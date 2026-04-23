# KenchiVest - Premium Investment Platform

**Smart Investing Made Simple**

A premium fintech investment platform built with React, TypeScript, Tailwind CSS, and Supabase. Features real-time stock/crypto trading, BTC payment verification, and admin approval system.

![KenchiVest](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

- ✅ **User Authentication** - Email/Phone signup with Google & Apple OAuth
- ✅ **BTC Payment System** - Users pay via Bitcoin to activate accounts
- ✅ **Admin Approval Dashboard** - Review and approve payments in real-time
- ✅ **Portfolio Management** - $10 starting balance for all users
- ✅ **Stock & Crypto Trading** - Buy/sell BTC, ETH, SOL, AAPL, TSLA, GOOGL, MSFT, NVDA
- ✅ **Transaction History** - Complete audit trail of all trades
- ✅ **Send/Withdraw Crypto** - Transfer to external BTC wallets
- ✅ **Premium UI/UX** - Blue gradient fintech design with smooth animations
- ✅ **Mobile Responsive** - Fully optimized for mobile devices

## 🎨 Design

- **Colors:** Deep navy blue (#0F2847, #1E5A8E), Pink accent (#EC4899), Success green (#10B981)
- **Gradient:** Blue gradient background (#1E3A5F → #2B5A8E → #5AB2D8)
- **Typography:** Inter font family
- **Style:** Clean, minimal, premium fintech aesthetic inspired by Robinhood

## 📱 Screens

1. **Splash Screen** - KenchiVest logo with animated upward arrow
2. **Login/Signup** - Email or phone authentication with social login
3. **Payment Verification** - BTC payment submission with TX hash
4. **Dashboard** - Portfolio overview, quick actions, market list, growth chart
5. **Investment** - Search and trade stocks/crypto with live prices
6. **Activity** - Transaction history with filters
7. **Profile** - User settings, security, verification status
8. **Admin Panel** - Approve/reject pending payments

## 🏗️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Animations:** Motion (Framer Motion)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Authentication:** Supabase Auth

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- pnpm (or npm)
- Supabase account

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd kenchivest
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Configure Supabase
Your Supabase project is already configured:
- **Project ID:** iibhgvzfhuugiczjntgz
- **URL:** https://iibhgvzfhuugiczjntgz.supabase.co

### 4. Deploy Backend (CRITICAL)
1. Go to your Figma Make settings
2. Navigate to Supabase section
3. Click **"Deploy Edge Function"**
4. Wait for deployment confirmation

### 5. Run Development Server
```bash
# The Vite dev server is already running in Figma Make
# Access your app in the Make preview panel
```

## 💰 Payment System

### BTC Payment Address
```
1PyyCBQ39xntcx3yZTx5FYjaeU2cVbJ7NK
```

### Payment Flow
1. User creates account
2. Redirected to payment screen
3. Sends Bitcoin to provided address
4. Enters transaction hash and amount
5. Admin reviews and approves payment
6. User gains full platform access

### Admin Approval
- Login to any account
- Navigate to **Profile → Admin: Approve Payments**
- Review pending payments with transaction details
- Approve or reject with one click

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx                    # Main application
│   ├── lib/
│   │   └── api.ts                 # API client
│   └── components/
│       ├── SplashScreen.tsx       # Landing animation
│       ├── AuthScreen.tsx         # Login/signup
│       ├── Dashboard.tsx          # Main dashboard
│       ├── InvestScreen.tsx       # Trading interface
│       ├── ActivityScreen.tsx     # Transaction history
│       ├── ProfileScreen.tsx      # User profile
│       ├── PaymentScreen.tsx      # BTC payment
│       ├── AdminApproval.tsx      # Admin panel
│       └── BottomNav.tsx          # Navigation bar
├── styles/
│   ├── theme.css                  # Theme variables
│   └── fonts.css                  # Font imports
└── utils/supabase/
    └── info.tsx                   # Supabase config (auto-generated)

supabase/functions/server/
├── index.tsx                      # Backend API routes
└── kv_store.tsx                   # Database utilities (auto-generated)
```

## 🔗 API Endpoints

### Authentication
- `POST /make-server-ce3a103f/signup` - Create account
- `POST /make-server-ce3a103f/login` - Login user
- `GET /make-server-ce3a103f/session` - Get current session

### Payments
- `POST /make-server-ce3a103f/payment/submit` - Submit BTC payment
- `GET /make-server-ce3a103f/payment/status` - Check payment status
- `GET /make-server-ce3a103f/payments/pending` - Get all payments (admin)
- `POST /make-server-ce3a103f/payment/approve` - Approve/reject payment

### Portfolio & Trading
- `POST /make-server-ce3a103f/portfolio/init` - Initialize portfolio
- `GET /make-server-ce3a103f/portfolio` - Get portfolio data
- `GET /make-server-ce3a103f/markets` - Get available assets
- `POST /make-server-ce3a103f/buy` - Buy/sell assets
- `GET /make-server-ce3a103f/transactions` - Get transaction history

## 🗄️ Database Schema (Key-Value Store)

```
user:{userId}              # User profile data
portfolio:{userId}         # Portfolio holdings & balance
payment:{paymentId}        # Payment verification records
all_payments               # Array of all payment IDs
user_payments:{userId}     # Array of user's payment IDs
transactions:{userId}      # Array of user's transactions
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Sign up new user (email + password)
- [ ] Submit BTC payment with TX hash
- [ ] Admin login and approve payment
- [ ] Buy stock (e.g., AAPL)
- [ ] Buy crypto (e.g., BTC)
- [ ] View updated portfolio balance
- [ ] Check transaction history
- [ ] Send/withdraw crypto
- [ ] Test on mobile device
- [ ] Logout and login again

### Test Accounts
Create test accounts with any email/password combination. All new users start with $10,000 demo balance after payment approval.

## 🚀 Deployment

This is a Figma Make project. To deploy:

1. **Backend:** Deploy Supabase Edge Function via Make settings
2. **Frontend:** Automatically deployed with Figma Make

### Production URL
Your app will be accessible at the Supabase project URL once deployed.

## 📱 Mobile Testing

The app is fully responsive. To test on your phone:

1. Deploy the backend
2. Access the Make preview URL on your mobile browser
3. Or share the production link after deployment

## 🔐 Security Notes

- ✅ Secret keys stored in Supabase environment (not exposed to frontend)
- ✅ JWT-based authentication with Supabase Auth
- ✅ API routes protected with user authentication
- ✅ Payment verification required before trading access
- ⚠️ This is a demo/prototype - NOT for production financial use
- ⚠️ No real money transactions - demo funds only

## 🤝 Contributing

This is a personal project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**KenchiVest Team**

- BTC Payment Address: 1PyyCBQ39xntcx3yZTx5FYjaeU2cVbJ7NK
- Supabase Project: iibhgvzfhuugiczjntgz

## 🎯 Roadmap

- [ ] Real-time price updates via WebSocket
- [ ] Push notifications for trades
- [ ] Advanced charts with TradingView
- [ ] Watchlist feature
- [ ] Price alerts
- [ ] Social trading features
- [ ] Referral program

---

**Made with ❤️ using React, Supabase, and Tailwind CSS**
