import { useState } from 'react';
import { Lock, Mail, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import { Logo } from './Logo';

interface AuthScreenProps {
  onAuth: (user: any) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [usePhone, setUsePhone] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authEmail = usePhone ? `${phone}@kenchivest.app` : email;

      if (isSignup) {
        await api.signup(authEmail, password, username || authEmail.split('@')[0]);
        const loginData = await api.login(authEmail, password);
        onAuth(loginData.user);
      } else {
        const data = await api.login(authEmail, password);
        onAuth(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url("/src/imports/Screenshot_19-4-2026_20746_web.whatsapp.com-1.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-navy/30 backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex justify-center mb-4">
              <Logo size="lg" showText={false} variant="dark" />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isSignup ? 'Start your investment journey' : 'Continue to your portfolio'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl"
              >
                <p className="text-sm text-destructive text-center">{error}</p>
              </motion.div>
            )}

            <div className="flex gap-2 p-1 bg-secondary rounded-2xl">
              <button
                type="button"
                onClick={() => setUsePhone(false)}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  !usePhone
                    ? 'bg-white shadow-md text-navy'
                    : 'text-muted-foreground'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setUsePhone(true)}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  usePhone
                    ? 'bg-white shadow-md text-navy'
                    : 'text-muted-foreground'
                }`}
              >
                Phone
              </button>
            </div>

            {usePhone ? (
              <div>
                <label className="block mb-2 text-sm font-medium text-navy">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/50 transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block mb-2 text-sm font-medium text-navy">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/50 transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            )}

            {isSignup && (
              <div>
                <label className="block mb-2 text-sm font-medium text-navy">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-4 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/50 transition-all"
                  placeholder="Choose a username"
                  required
                />
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-medium text-navy">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/50 transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-navy to-navy-light text-white rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
            >
              {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 border-2 border-border rounded-2xl hover:bg-secondary transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 border-2 border-border rounded-2xl hover:bg-secondary transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-pink hover:text-pink/80 font-medium"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 px-8">
          By continuing, you agree to KenchiVest's Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
