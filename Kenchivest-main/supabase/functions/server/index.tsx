import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to get authenticated user
const getAuthUser = async (authHeader: string | null) => {
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
};

// Health check endpoint
app.get("/make-server-ce3a103f/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth Routes
app.post("/make-server-ce3a103f/signup", async (c) => {
  try {
    const { email, password, username } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username },
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error.message);
      return c.json({ error: error.message }, 400);
    }

    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      username,
      followers: 0,
      following: 0,
      createdAt: new Date().toISOString()
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup server error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-ce3a103f/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_ANON_KEY'),
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login error:', error.message);
      return c.json({ error: error.message }, 400);
    }

    const userData = await kv.get(`user:${data.user.id}`);

    return c.json({
      session: data.session,
      user: userData
    });
  } catch (error) {
    console.log('Login server error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-ce3a103f/session", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    return c.json({ user: userData });
  } catch (error) {
    console.log('Session error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Posts Routes
app.post("/make-server-ce3a103f/posts", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { image, caption } = await c.req.json();
    const postId = crypto.randomUUID();
    const post = {
      id: postId,
      userId: user.id,
      image,
      caption,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    await kv.set(`post:${postId}`, post);

    const userPosts = await kv.get(`user_posts:${user.id}`) || [];
    userPosts.unshift(postId);
    await kv.set(`user_posts:${user.id}`, userPosts);

    return c.json({ post });
  } catch (error) {
    console.log('Create post error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-ce3a103f/posts", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userPosts = await kv.get(`user_posts:${user.id}`) || [];
    const posts = [];

    for (const postId of userPosts) {
      const post = await kv.get(`post:${postId}`);
      if (post) posts.push(post);
    }

    return c.json({ posts });
  } catch (error) {
    console.log('Get posts error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Like Routes
app.post("/make-server-ce3a103f/posts/:postId/like", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const post = await kv.get(`post:${postId}`);

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const likedBy = post.likedBy || [];
    const alreadyLiked = likedBy.includes(user.id);

    if (alreadyLiked) {
      post.likedBy = likedBy.filter(id => id !== user.id);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(user.id);
      post.likes += 1;
    }

    await kv.set(`post:${postId}`, post);

    return c.json({ post });
  } catch (error) {
    console.log('Like post error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Comment Routes
app.post("/make-server-ce3a103f/posts/:postId/comments", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const postId = c.req.param('postId');
    const { text } = await c.req.json();
    const post = await kv.get(`post:${postId}`);

    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }

    const userData = await kv.get(`user:${user.id}`);
    const comment = {
      id: crypto.randomUUID(),
      author: userData.username,
      text,
      time: 'Just now'
    };

    post.comments = post.comments || [];
    post.comments.push(comment);

    await kv.set(`post:${postId}`, post);

    return c.json({ comment });
  } catch (error) {
    console.log('Add comment error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Follower Routes
app.post("/make-server-ce3a103f/follow/:userId", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const targetUserId = c.req.param('userId');

    const followers = await kv.get(`followers:${targetUserId}`) || [];
    const following = await kv.get(`following:${user.id}`) || [];

    const isFollowing = followers.includes(user.id);

    if (isFollowing) {
      const updatedFollowers = followers.filter(id => id !== user.id);
      const updatedFollowing = following.filter(id => id !== targetUserId);
      await kv.set(`followers:${targetUserId}`, updatedFollowers);
      await kv.set(`following:${user.id}`, updatedFollowing);

      const targetUser = await kv.get(`user:${targetUserId}`);
      if (targetUser) {
        targetUser.followers = Math.max(0, (targetUser.followers || 0) - 1);
        await kv.set(`user:${targetUserId}`, targetUser);
      }
    } else {
      followers.push(user.id);
      following.push(targetUserId);
      await kv.set(`followers:${targetUserId}`, followers);
      await kv.set(`following:${user.id}`, following);

      const targetUser = await kv.get(`user:${targetUserId}`);
      if (targetUser) {
        targetUser.followers = (targetUser.followers || 0) + 1;
        await kv.set(`user:${targetUserId}`, targetUser);
      }
    }

    return c.json({ isFollowing: !isFollowing });
  } catch (error) {
    console.log('Follow error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-ce3a103f/stats", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    const userPosts = await kv.get(`user_posts:${user.id}`) || [];

    let totalLikes = 0;
    let totalComments = 0;

    for (const postId of userPosts) {
      const post = await kv.get(`post:${postId}`);
      if (post) {
        totalLikes += post.likes || 0;
        totalComments += (post.comments || []).length;
      }
    }

    return c.json({
      followers: userData?.followers || 0,
      totalLikes,
      totalComments
    });
  } catch (error) {
    console.log('Get stats error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Investment Routes
app.post("/make-server-ce3a103f/portfolio/init", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const existingPortfolio = await kv.get(`portfolio:${user.id}`);
    if (existingPortfolio) {
      return c.json({ portfolio: existingPortfolio });
    }

    const portfolio = {
      userId: user.id,
      balance: 10000,
      invested: 0,
      profitAmount: 0,
      profitPercent: 0,
      holdings: {},
      history: [
        { time: '9AM', value: 10000 },
        { time: '12PM', value: 10050 },
        { time: '3PM', value: 10100 },
        { time: '6PM', value: 10200 },
        { time: 'Now', value: 10000 }
      ],
      createdAt: new Date().toISOString()
    };

    await kv.set(`portfolio:${user.id}`, portfolio);
    return c.json({ portfolio });
  } catch (error) {
    console.log('Init portfolio error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-ce3a103f/portfolio", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfolio = await kv.get(`portfolio:${user.id}`) || {
      balance: 10000,
      invested: 0,
      profitAmount: 0,
      profitPercent: 0,
      holdings: {},
      history: [
        { time: '9AM', value: 10000 },
        { time: '12PM', value: 10050 },
        { time: '3PM', value: 10100 },
        { time: '6PM', value: 10200 },
        { time: 'Now', value: 10000 }
      ]
    };

    return c.json({ portfolio });
  } catch (error) {
    console.log('Get portfolio error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-ce3a103f/markets", async (c) => {
  try {
    const markets = [
      { id: 'AAPL', name: 'Apple Inc.', symbol: 'AAPL', price: 178.32, change: 2.45, type: 'stock' },
      { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', price: 94234.56, change: 5.67, type: 'crypto' },
      { id: 'TSLA', name: 'Tesla Inc.', symbol: 'TSLA', price: 248.91, change: -1.23, type: 'stock' },
      { id: 'ETH', name: 'Ethereum', symbol: 'ETH', price: 3456.78, change: 3.45, type: 'crypto' },
      { id: 'GOOGL', name: 'Alphabet Inc.', symbol: 'GOOGL', price: 142.65, change: 1.89, type: 'stock' },
      { id: 'MSFT', name: 'Microsoft Corp.', symbol: 'MSFT', price: 412.34, change: 0.87, type: 'stock' },
      { id: 'SOL', name: 'Solana', symbol: 'SOL', price: 156.43, change: 8.92, type: 'crypto' },
      { id: 'NVDA', name: 'NVIDIA Corp.', symbol: 'NVDA', price: 876.54, change: 4.21, type: 'stock' },
    ];

    return c.json({ markets });
  } catch (error) {
    console.log('Get markets error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-ce3a103f/buy", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { assetId, amount, type } = await c.req.json();

    const portfolio = await kv.get(`portfolio:${user.id}`) || {
      balance: 10000,
      invested: 0,
      holdings: {},
      history: []
    };

    if (type === 'buy' && portfolio.balance < amount) {
      return c.json({ error: 'Insufficient balance' }, 400);
    }

    const markets = await c.req.json();
    const asset = markets.find((m: any) => m.id === assetId);

    if (!asset) {
      return c.json({ error: 'Asset not found' }, 404);
    }

    const quantity = amount / asset.price;

    if (type === 'buy') {
      portfolio.balance -= amount;
      portfolio.invested += amount;
      portfolio.holdings[assetId] = (portfolio.holdings[assetId] || 0) + quantity;
    } else {
      portfolio.balance += amount;
      portfolio.invested -= amount;
      portfolio.holdings[assetId] = Math.max(0, (portfolio.holdings[assetId] || 0) - quantity);
    }

    await kv.set(`portfolio:${user.id}`, portfolio);

    const transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      assetId,
      assetSymbol: assetId,
      type,
      amount,
      quantity,
      price: asset.price,
      date: new Date().toISOString(),
    };

    const transactions = await kv.get(`transactions:${user.id}`) || [];
    transactions.unshift(transaction);
    await kv.set(`transactions:${user.id}`, transactions.slice(0, 100));

    return c.json({ success: true, portfolio, transaction });
  } catch (error) {
    console.log('Buy asset error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-ce3a103f/transactions", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactions = await kv.get(`transactions:${user.id}`) || [];

    const formattedTransactions = transactions.map((t: any) => {
      const date = new Date(t.date);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let formattedDate;
      if (diffDays > 0) {
        formattedDate = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        formattedDate = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMins > 0) {
        formattedDate = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      } else {
        formattedDate = 'Just now';
      }

      return { ...t, date: formattedDate };
    });

    return c.json({ transactions: formattedTransactions });
  } catch (error) {
    console.log('Get transactions error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

// Payment Routes
app.post("/make-server-ce3a103f/payment/submit", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { txHash, amount } = await c.req.json();

    if (!txHash || !amount) {
      return c.json({ error: 'Missing transaction hash or amount' }, 400);
    }

    const userData = await kv.get(`user:${user.id}`);

    const payment = {
      id: crypto.randomUUID(),
      userId: user.id,
      userEmail: userData?.email || user.email,
      txHash,
      amount,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
    };

    await kv.set(`payment:${payment.id}`, payment);

    const allPayments = await kv.get('all_payments') || [];
    allPayments.unshift(payment.id);
    await kv.set('all_payments', allPayments);

    const userPayments = await kv.get(`user_payments:${user.id}`) || [];
    userPayments.unshift(payment.id);
    await kv.set(`user_payments:${user.id}`, userPayments);

    return c.json({ success: true, payment });
  } catch (error) {
    console.log('Submit payment error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-ce3a103f/payment/status", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userPayments = await kv.get(`user_payments:${user.id}`) || [];

    if (userPayments.length === 0) {
      return c.json({ status: 'none', hasApprovedPayment: false });
    }

    const payments = [];
    for (const paymentId of userPayments) {
      const payment = await kv.get(`payment:${paymentId}`);
      if (payment) payments.push(payment);
    }

    const approvedPayment = payments.find(p => p.status === 'approved');
    const pendingPayment = payments.find(p => p.status === 'pending');

    if (approvedPayment) {
      return c.json({
        status: 'approved',
        hasApprovedPayment: true,
        payment: approvedPayment
      });
    }

    if (pendingPayment) {
      return c.json({
        status: 'pending',
        hasApprovedPayment: false,
        payment: pendingPayment
      });
    }

    return c.json({ status: 'none', hasApprovedPayment: false });
  } catch (error) {
    console.log('Get payment status error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-ce3a103f/payments/pending", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const allPaymentIds = await kv.get('all_payments') || [];
    const payments = [];

    for (const paymentId of allPaymentIds) {
      const payment = await kv.get(`payment:${paymentId}`);
      if (payment) {
        const date = new Date(payment.submittedAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        let formattedDate;
        if (diffDays > 0) {
          formattedDate = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else if (diffHours > 0) {
          formattedDate = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffMins > 0) {
          formattedDate = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        } else {
          formattedDate = 'Just now';
        }

        payments.push({ ...payment, submittedAt: formattedDate });
      }
    }

    return c.json({ payments });
  } catch (error) {
    console.log('Get pending payments error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-ce3a103f/payment/approve", async (c) => {
  try {
    const user = await getAuthUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { paymentId, status } = await c.req.json();

    if (!paymentId || !status || !['approved', 'rejected'].includes(status)) {
      return c.json({ error: 'Invalid payment ID or status' }, 400);
    }

    const payment = await kv.get(`payment:${paymentId}`);

    if (!payment) {
      return c.json({ error: 'Payment not found' }, 404);
    }

    payment.status = status;
    payment.approvedAt = new Date().toISOString();
    payment.approvedBy = user.id;

    await kv.set(`payment:${paymentId}`, payment);

    if (status === 'approved') {
      const targetUser = await kv.get(`user:${payment.userId}`);
      if (targetUser) {
        targetUser.paymentApproved = true;
        await kv.set(`user:${payment.userId}`, targetUser);
      }
    }

    return c.json({ success: true, payment });
  } catch (error) {
    console.log('Approve payment error:', error.message);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);