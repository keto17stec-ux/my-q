import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Plus, Minus, Send, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Logo } from './Logo';

interface DashboardProps {
  user: any;
  portfolio: any;
  markets: any[];
  onNavigate: (screen: string) => void;
}

export function Dashboard({ user, portfolio, markets, onNavigate }: DashboardProps) {
  const [timeframe, setTimeframe] = useState('1D');

  const chartData = portfolio?.history || [];

  const profitPercent = portfolio?.profitPercent || 0;
  const profitAmount = portfolio?.profitAmount || 0;
  const isProfit = profitPercent >= 0;

  return (
    <div className="pb-24">
      <div className="bg-gradient-to-br from-navy via-navy-light to-navy text-white p-6 rounded-b-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Logo size="sm" showText={false} variant="light" />
          <div className="flex-1 ml-4">
          <p className="text-white/70 text-sm mb-1">Total Balance</p>
          <h1 className="text-5xl font-bold mb-2">
            ${portfolio?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </h1>
          <div className="flex items-center gap-2">
            {isProfit ? (
              <ArrowUpRight className="w-5 h-5 text-green" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-destructive" />
            )}
            <span className={isProfit ? 'text-green' : 'text-destructive'}>
              {isProfit ? '+' : ''}{profitPercent.toFixed(2)}%
            </span>
            <span className="text-white/70">
              ({isProfit ? '+' : ''}${Math.abs(profitAmount).toFixed(2)})
            </span>
          </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('invest')}
            className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-green/20 flex items-center justify-center">
              <Plus className="w-6 h-6 text-green" />
            </div>
            <span className="text-xs font-medium">Buy</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('invest')}
            className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-pink/20 flex items-center justify-center">
              <Minus className="w-6 h-6 text-pink" />
            </div>
            <span className="text-xs font-medium">Sell</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('withdraw')}
            className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">Send</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('deposit')}
            className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium">Deposit</span>
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-border mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">Portfolio Growth</h3>
            <div className="flex gap-2">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    timeframe === tf
                      ? 'bg-pink text-white'
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="time"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  formatter={(value: any) => [`$${value}`, 'Balance']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-navy">Markets</h3>
            <button
              onClick={() => onNavigate('invest')}
              className="text-sm text-pink font-medium hover:text-pink/80"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {markets.map((market) => (
              <motion.button
                key={market.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('invest')}
                className="w-full bg-white rounded-2xl p-4 shadow-md border border-border hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy/10 to-pink/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-navy">
                        {market.symbol.charAt(0)}
                      </span>
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
    </div>
  );
}
