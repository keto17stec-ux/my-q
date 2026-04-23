import { TrendingUp } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'md', showText = true, variant = 'light' }: LogoProps) {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-sm', icon: 'w-3 h-3', iconOffset: '-top-1 -right-3' },
    md: { container: 'w-12 h-12', text: 'text-lg', icon: 'w-4 h-4', iconOffset: '-top-1 -right-4' },
    lg: { container: 'w-16 h-16', text: 'text-2xl', icon: 'w-6 h-6', iconOffset: '-top-2 -right-5' },
    xl: { container: 'w-20 h-20', text: 'text-4xl', icon: 'w-8 h-8', iconOffset: '-top-2 -right-6' },
  };

  const textColor = variant === 'light' ? 'text-white' : 'text-navy';
  const gradientBg = variant === 'light'
    ? 'bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border-2 border-white/30'
    : 'bg-gradient-to-br from-navy to-navy-light';

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizes[size].container} rounded-2xl ${gradientBg} flex items-center justify-center shadow-xl relative`}>
        <span className={`${sizes[size].text} font-bold ${textColor}`}>K</span>
        <TrendingUp
          className={`absolute ${sizes[size].iconOffset} ${sizes[size].icon} ${variant === 'light' ? 'text-green' : 'text-pink'}`}
          strokeWidth={3}
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizes[size].text} ${textColor} tracking-tight leading-none`}>
            KENCHIVEST
          </span>
          <span className={`text-xs ${variant === 'light' ? 'text-white/70' : 'text-muted-foreground'}`}>
            Smart Investing Made Simple
          </span>
        </div>
      )}
    </div>
  );
}
