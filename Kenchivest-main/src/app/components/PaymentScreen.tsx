import { useState } from 'react';
import { Copy, Check, Bitcoin, Upload, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

interface PaymentScreenProps {
  user: any;
  onBack: () => void;
  onPaymentSubmitted: () => void;
}

export function PaymentScreen({ user, onBack, onPaymentSubmitted }: PaymentScreenProps) {
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const BTC_ADDRESS = '1PyyCBQ39xntcx3yZTx5FYjaeU2cVbJ7NK';

  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitPayment = async () => {
    if (!txHash.trim() || !amount || parseFloat(amount) <= 0) {
      setError('Please enter transaction hash and amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.submitPayment(txHash, parseFloat(amount));
      setSuccess(true);
      setTimeout(() => {
        onPaymentSubmitted();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment');
      setLoading(false);
    }
  };

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
        <button onClick={onBack} className="text-white/90 hover:text-white mb-6">
          ← Back
        </button>

      <div className="max-w-lg mx-auto">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bitcoin className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-2">Fund Your Account</h1>
            <p className="text-muted-foreground">Send Bitcoin to activate your account</p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green" />
              </div>
              <h3 className="text-2xl font-bold text-navy mb-2">Payment Submitted!</h3>
              <p className="text-muted-foreground">
                Your payment is pending approval. You'll be notified once verified.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block mb-3 text-sm font-semibold text-navy">
                  1. Send Bitcoin to this address
                </label>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border-2 border-orange-200">
                  <p className="text-xs text-muted-foreground mb-2 text-center">BTC Address</p>
                  <p className="text-sm font-mono font-semibold text-navy text-center break-all mb-4">
                    {BTC_ADDRESS}
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={copyAddress}
                    className="w-full py-3 bg-white hover:bg-orange-50 border-2 border-orange-300 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-orange-600"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Address
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-3 text-sm font-semibold text-navy">
                  2. Enter payment details
                </label>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-navy">
                      Amount Sent (BTC)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-4 bg-input-background border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-lg font-semibold"
                      placeholder="0.001"
                      step="0.00000001"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-navy">
                      Transaction Hash (TXID)
                    </label>
                    <div className="relative">
                      <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-input-background border-2 border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 font-mono text-sm"
                        placeholder="Enter your transaction hash"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Find this in your wallet after sending Bitcoin
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-destructive/10 border-2 border-destructive/20 rounded-2xl flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitPayment}
                disabled={loading || !txHash.trim() || !amount}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Submitting...' : 'Submit Payment Proof'}
              </motion.button>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <p className="text-xs text-blue-900 font-medium mb-2">ℹ️ Important Notes:</p>
                <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                  <li>Minimum deposit: 0.0001 BTC</li>
                  <li>Your payment will be verified within 24 hours</li>
                  <li>Account will be activated after approval</li>
                  <li>Network confirmations may take 10-30 minutes</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
