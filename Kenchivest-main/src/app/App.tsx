import { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { InvestScreen } from "./components/InvestScreen";
import { ActivityScreen } from "./components/ActivityScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { PaymentScreen } from "./components/PaymentScreen";
import { AdminApproval } from "./components/AdminApproval";
import { BottomNav } from "./components/BottomNav";
import { api, getAuthToken } from "./lib/api";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [markets, setMarkets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState("dashboard");

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const { user: userData } = await api.getSession();
        setUser(userData);
        await loadData();
      } catch (error) {
        console.error("Session check failed:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const [
        portfolioData,
        marketsData,
        transactionsData,
        paymentData,
      ] = await Promise.all([
        api.getPortfolio(),
        api.getMarkets(),
        api.getTransactions(),
        api.getPaymentStatus(),
      ]);

      setPortfolio(portfolioData.portfolio);
      setMarkets(marketsData.markets || []);
      setTransactions(transactionsData.transactions || []);
      setPaymentStatus(paymentData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (userData: any) => {
    setUser(userData);
    await api.initPortfolio();
    await loadData();
  };

  useEffect(() => {
    (window as any).navigateToAdmin = () =>
      setActiveScreen("admin");
  }, []);

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setPortfolio(null);
    setMarkets([]);
    setTransactions([]);
    setActiveScreen("dashboard");
  };

  if (showSplash) {
    return (
      <SplashScreen onComplete={() => setShowSplash(false)} />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (activeScreen === "admin") {
    return (
      <AdminApproval
        user={user}
        onBack={() => setActiveScreen("dashboard")}
      />
    );
  }

  if (
    paymentStatus &&
    !paymentStatus.hasApprovedPayment &&
    activeScreen !== "admin"
  ) {
    return (
      <PaymentScreen
        user={user}
        onBack={handleLogout}
        onPaymentSubmitted={() => loadData()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {activeScreen === "dashboard" && (
        <Dashboard
          user={user}
          portfolio={portfolio}
          markets={markets}
          onNavigate={setActiveScreen}
        />
      )}

      {activeScreen === "invest" && (
        <InvestScreen
          markets={markets}
          onBack={() => setActiveScreen("dashboard")}
          onRefresh={loadData}
        />
      )}

      {activeScreen === "activity" && (
        <ActivityScreen
          transactions={transactions}
          onBack={() => setActiveScreen("dashboard")}
        />
      )}

      {activeScreen === "profile" && (
        <ProfileScreen
          user={user}
          onBack={() => setActiveScreen("dashboard")}
          onLogout={handleLogout}
        />
      )}

      {activeScreen === "deposit" && (
        <div className="min-h-screen bg-background pb-24 p-6">
          <button
            onClick={() => setActiveScreen("dashboard")}
            className="text-navy mb-4"
          >
            ← Back
          </button>
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
            <h2 className="text-2xl font-bold text-navy mb-4">
              Deposit Funds
            </h2>
            <p className="text-muted-foreground">
              This is a demo app. Your portfolio starts with
              $10,000 in demo funds.
            </p>
          </div>
        </div>
      )}

      {activeScreen === "withdraw" && (
        <div className="min-h-screen bg-background pb-24 p-6">
          <button
            onClick={() => setActiveScreen("dashboard")}
            className="text-navy mb-4"
          >
            ← Back
          </button>
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
            <h2 className="text-2xl font-bold text-navy mb-4">
              Send/Withdraw
            </h2>
            <p className="text-muted-foreground mb-4">
              Send crypto to external wallets or withdraw to
              your bank account.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-navy">
                  Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Enter BTC wallet address"
                  className="w-full px-4 py-4 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/50"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-navy">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-4 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/50"
                />
              </div>
              <button className="w-full py-4 bg-gradient-to-r from-pink to-pink/80 text-white rounded-2xl font-semibold">
                Send
              </button>
              <p className="text-xs text-muted-foreground text-center">
                Demo feature - transactions will not be
                processed
              </p>
            </div>
          </div>
        </div>
      )}

      <BottomNav
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
      />
    </div>
  );
}