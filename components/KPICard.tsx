'use client';

import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: number;
  unit: string;
  trend?: number;
  status?: 'normal' | 'warning' | 'critical';
  target?: number;
  description?: string;
  icon?: React.ReactNode;
  format?: 'number' | 'percentage' | 'currency' | 'hours';
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  status = 'normal',
  target,
  description,
  icon,
  format = 'number',
  onClick,
}: KPICardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
      case 'hours':
        return `${val.toFixed(1)}h`;
      default:
        return val.toLocaleString('en-US', { maximumFractionDigits: 1 });
    }
  };

  const statusColor = {
    normal: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
    critical: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
  };

  const textColor = {
    normal: 'text-green-700 dark:text-green-300',
    warning: 'text-yellow-700 dark:text-yellow-300',
    critical: 'text-red-700 dark:text-red-300',
  };

  const trendPositive = trend && trend >= 0;

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105',
        statusColor[status]
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        {status !== 'normal' && (
          <AlertCircle className={cn('w-4 h-4 ml-2 flex-shrink-0', textColor[status])} />
        )}
        {icon && <div className="w-8 h-8 text-primary/60 flex-shrink-0 ml-2">{icon}</div>}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">
            {formatValue(value)}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>

        {target && (
          <div className="text-xs text-muted-foreground">
            Target: {formatValue(target)}
            <div className="w-full bg-secondary h-1 rounded-full mt-1 overflow-hidden">
              <div
                className="bg-primary h-full"
                style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-2">
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1 text-xs font-medium', textColor[status])}>
              {trendPositive ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-1 ml-auto">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
