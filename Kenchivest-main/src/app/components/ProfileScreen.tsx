import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

interface ProfileScreenProps {
  user: any;
  onBack: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ user, onBack, onLogout }: ProfileScreenProps) {
  const handleLogout = async () => {
    await api.logout();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-white border-b border-border z-10">
        <div className="p-6">
          <button onClick={onBack} className="text-navy hover:text-navy/70">
            ← Back
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-gradient-to-br from-navy to-navy-light rounded-3xl p-6 text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.username || 'User'}</h2>
              <p className="text-white/70">{user?.email || 'email@example.com'}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-3 py-1 bg-green/20 rounded-full flex items-center gap-1">
                  <Check className="w-4 h-4 text-green" />
                  <span className="text-xs font-medium text-green">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-navy text-sm">Account</h3>

            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary transition-all border-t border-border">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-navy" />
                <span className="text-navy">Personal Information</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary transition-all border-t border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-navy" />
                <span className="text-navy">Verification Status</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green font-medium">Verified</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-navy text-sm">Security</h3>

            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary transition-all border-t border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-navy" />
                <span className="text-navy">Change Password</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary transition-all border-t border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-navy" />
                <span className="text-navy">Security PIN</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary transition-all border-t border-border">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-navy" />
                <span className="text-navy">Two-Factor Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-green font-medium">Enabled</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-border overflow-hidden">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-navy text-sm">Preferences</h3>

            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary transition-all border-t border-border">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-navy" />
                <span className="text-navy">Notifications</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-secondary transition-all border-t border-border">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-navy" />
                <span className="text-navy">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 shadow-md">
            <button
              onClick={() => (window as any).navigateToAdmin?.()}
              className="w-full text-white font-semibold text-center"
            >
              🔐 Admin: Approve Payments
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full bg-white rounded-2xl p-4 shadow-md border border-border hover:shadow-lg transition-all flex items-center justify-center gap-2 text-destructive font-semibold"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </div>
    </div>
  );
}
