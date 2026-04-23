import { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownRight, Bitcoin, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../lib/api';

interface InvestScreenProps {
  markets: any[];
  onBack: () => void;
  onRefresh: () => void;
}

export function InvestScreen({ markets, onBack, onRefresh }: InvestScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [buyMode, setBuyMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredMarkets = markets.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTransaction = async () => {
    if (!selectedAsset || !amount || parseFloat(amount) <= 0) return;

    setLoading(true);
    try {
      await api.buyAsset(selectedAsset.id, parseFloat(amount), buyMode ? 'buy' : 'sell');
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedAsset(null);
        setAmount('');
        onRefresh();
      }, 2000);
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedAsset) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 bg-white border-b border-border z-10">
          <div className="p-6">
            <button onClick={() => setSelectedAsset(null)} className="text-navy hover:text-navy/70">
              ← Back
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-border mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-navy/10 to-pink/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-navy">
                  {selectedAsset.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy">{selectedAsset.name}</h2>
                <p className="text-muted-foreground">{selectedAsset.symbol}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Current Price</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-bold text-navy">
                  ${selectedAsset.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-1">
                  {selectedAsset.change >= 0 ? (
                    <ArrowUpRight className="w-5 h-5 text-green" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-destructive" />
                  )}
                  <span className={selectedAsset.change >= 0 ? 'text-green font-semibold' : 'text-destructive font-semibold'}>
                    {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-1 bg-secondary rounded-2xl mb-6">
              <button
                onClick={() => setBuyMode(true)}
                className={`flex-1 py-3 rounded-xl transition-all font-semibold ${
                  buyMode
                    ? 'bg-green text-white shadow-md'
                    : 'text-muted-foreground'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setBuyMode(false)}
                className={`flex-1 py-3 rounded-xl transition-all font-semibold ${
                  !buyMode
                    ? 'bg-pink text-white shadow-md'
                    : 'text-muted-foreground'
                }`}
              >
                Sell
              </button>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-navy">
                Amount (USD)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-input-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/50 text-xl font-semibold"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {amount && (
                <p className="mt-2 text-sm text-muted-foreground">
                  ≈ {(parseFloat(amount) / selectedAsset.price).toFixed(6)} {selectedAsset.symbol}
                </p>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleTransaction}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className={`w-full py-4 rounded-2xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                buyMode
                  ? 'bg-gradient-to-r from-green to-green/80'
                  : 'bg-gradient-to-r from-pink to-pink/80'
              }`}
            >
              {loading ? 'Processing...' : buyMode ? `Buy ${selectedAsset.symbol}` : `Sell ${selectedAsset.symbol}`}
            </motion.button>

            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-green/10 border border-green/20 rounded-2xl text-center"
              >
                <p className="text-green font-semibold">Transaction Successful!</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-white border-b border-border z-10">
        <div className="p-6">
          <button onClick={onBack} className="text-navy hover:text-navy/70 mb-4">
            ← Back
          </button>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink/50"
              placeholder="Search stocks or crypto..."
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-navy mb-4">Available Assets</h2>
        <div className="space-y-3">
          {filteredMarkets.map((market) => (
            <motion.button
              key={market.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAsset(market)}
              className="w-full bg-white rounded-2xl p-4 shadow-md border border-border hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy/10 to-pink/10 flex items-center justify-center">
                    {market.type === 'crypto' ? (
                      <Bitcoin className="w-6 h-6 text-navy" />
                    ) : (
                      <span className="text-xl font-bold text-navy">
                        {market.symbol.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-navy">{market.name}</p>
                    <p className="text-sm text-muted-foreground">{market.symbol}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-navy">
                    ${market.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {market.change >= 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                    <span className={market.change >= 0 ? 'text-green text-sm font-medium' : 'text-destructive text-sm font-medium'}>
                      {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
