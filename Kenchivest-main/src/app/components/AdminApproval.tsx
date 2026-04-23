import { useState, useEffect } from 'react';
import { Check, X, Clock, Bitcoin, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

interface AdminApprovalProps {
  user: any;
  onBack: () => void;
}

export function AdminApproval({ user, onBack }: AdminApprovalProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await api.getPendingPayments();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: string) => {
    setProcessing(paymentId);
    try {
      await api.approvePayment(paymentId, 'approved');
      await loadPayments();
    } catch (error) {
      console.error('Error approving payment:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    setProcessing(paymentId);
    try {
      await api.approvePayment(paymentId, 'rejected');
      await loadPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
    } finally {
      setProcessing(null);
    }
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const approvedPayments = payments.filter(p => p.status === 'approved');
  const rejectedPayments = payments.filter(p => p.status === 'rejected');

  return (
    <div
      className="min-h-screen pb-24 p-6 relative"
      style={{
        backgroundImage: 'url("/src/imports/Screenshot_19-4-2026_20746_web.whatsapp.com-1.jpeg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-navy/40 backdrop-blur-sm"></div>
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="text-white/90 hover:text-white">
          ← Back
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={loadPayments}
          className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
        >
          <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold text-navy mb-2">Payment Approvals</h1>
          <p className="text-muted-foreground mb-8">Review and approve user payments</p>

          <div className="space-y-6">
            {/* Pending Payments */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold text-navy">
                  Pending ({pendingPayments.length})
                </h2>
              </div>

              {pendingPayments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending payments</p>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.map((payment) => (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                            <Bitcoin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-navy">{payment.userEmail}</p>
                            <p className="text-sm text-muted-foreground">{payment.submittedAt}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">
                            {payment.amount} BTC
                          </p>
                        </div>
                      </div>

                      <div className="mb-4 p-3 bg-white rounded-xl">
                        <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                        <p className="text-xs font-mono text-navy break-all">{payment.txHash}</p>
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleApprove(payment.id)}
                          disabled={processing === payment.id}
                          className="flex-1 py-3 bg-green hover:bg-green/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Check className="w-5 h-5" />
                          Approve
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(payment.id)}
                          disabled={processing === payment.id}
                          className="flex-1 py-3 bg-destructive hover:bg-destructive/90 text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <X className="w-5 h-5" />
                          Reject
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Payments */}
            {approvedPayments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-green" />
                  <h2 className="text-xl font-bold text-navy">
                    Approved ({approvedPayments.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {approvedPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="bg-green/10 border border-green/20 rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-navy">{payment.userEmail}</p>
                        <p className="text-sm text-muted-foreground">{payment.amount} BTC</p>
                      </div>
                      <div className="px-3 py-1 bg-green/20 rounded-full">
                        <p className="text-xs font-semibold text-green">Approved</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Payments */}
            {rejectedPayments.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <X className="w-5 h-5 text-destructive" />
                  <h2 className="text-xl font-bold text-navy">
                    Rejected ({rejectedPayments.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {rejectedPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-navy">{payment.userEmail}</p>
                        <p className="text-sm text-muted-foreground">{payment.amount} BTC</p>
                      </div>
                      <div className="px-3 py-1 bg-destructive/20 rounded-full">
                        <p className="text-xs font-semibold text-destructive">Rejected</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
