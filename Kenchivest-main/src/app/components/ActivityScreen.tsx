import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface ActivityScreenProps {
  transactions: any[];
  onBack: () => void;
}

export function ActivityScreen({ transactions, onBack }: ActivityScreenProps) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 bg-white border-b border-border z-10">
        <div className="p-6">
          <button onClick={onBack} className="text-navy hover:text-navy/70 mb-4">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-navy">Transaction History</h1>
        </div>
      </div>

      <div className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your investment activity will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-md border border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'buy' ? 'bg-green/10' : 'bg-pink/10'
                    }`}>
                      {transaction.type === 'buy' ? (
                        <ArrowDownRight className="w-6 h-6 text-green" />
                      ) : (
                        <ArrowUpRight className="w-6 h-6 text-pink" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-navy">
                        {transaction.type === 'buy' ? 'Bought' : 'Sold'} {transaction.assetSymbol}
                      </p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'buy' ? 'text-green' : 'text-pink'
                    }`}>
                      {transaction.type === 'buy' ? '-' : '+'}${transaction.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.quantity} {transaction.assetSymbol}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
