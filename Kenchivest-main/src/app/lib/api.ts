import { projectId, publicAnonKey } from '/utils/supabase/info';
import { createClient } from '@supabase/supabase-js';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce3a103f`;

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = localStorage.getItem('authToken');
  }
  return authToken;
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

export const supabaseClient = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export const api = {
  async signup(email: string, password: string, username: string) {
    return apiFetch('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },

  async login(email: string, password: string) {
    const data = await apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.session?.access_token) {
      setAuthToken(data.session.access_token);
    }
    return data;
  },

  async getSession() {
    return apiFetch('/session');
  },

  async logout() {
    await supabaseClient.auth.signOut();
    setAuthToken(null);
  },

  async getPosts() {
    return apiFetch('/posts');
  },

  async createPost(image: string, caption: string) {
    return apiFetch('/posts', {
      method: 'POST',
      body: JSON.stringify({ image, caption }),
    });
  },

  async likePost(postId: string) {
    return apiFetch(`/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  async addComment(postId: string, text: string) {
    return apiFetch(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  async getStats() {
    return apiFetch('/stats');
  },

  async followUser(userId: string) {
    return apiFetch(`/follow/${userId}`, {
      method: 'POST',
    });
  },

  async initPortfolio() {
    return apiFetch('/portfolio/init', {
      method: 'POST',
    });
  },

  async getPortfolio() {
    return apiFetch('/portfolio');
  },

  async getMarkets() {
    return apiFetch('/markets');
  },

  async buyAsset(assetId: string, amount: number, type: 'buy' | 'sell') {
    return apiFetch('/buy', {
      method: 'POST',
      body: JSON.stringify({ assetId, amount, type }),
    });
  },

  async getTransactions() {
    return apiFetch('/transactions');
  },

  async submitPayment(txHash: string, amount: number) {
    return apiFetch('/payment/submit', {
      method: 'POST',
      body: JSON.stringify({ txHash, amount }),
    });
  },

  async getPaymentStatus() {
    return apiFetch('/payment/status');
  },

  async getPendingPayments() {
    return apiFetch('/payments/pending');
  },

  async approvePayment(paymentId: string, status: 'approved' | 'rejected') {
    return apiFetch('/payment/approve', {
      method: 'POST',
      body: JSON.stringify({ paymentId, status }),
    });
  },
};
