'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { Card } from '@/components/ui/card';

// Energy Generation Trends Chart
export function EnergyGenerationTrends({ data }: { data: any[] }) {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Energy Generation Trends</h3>
        <p className="text-xs text-muted-foreground">Actual vs budgeted energy generation over the selected period</p>
        <div className="absolute top-6 right-6 text-red-400 text-sm font-semibold">-66.2% achieved</div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBudgeted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
          <Legend />
          <Area type="monotone" dataKey="budgeted" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBudgeted)" name="Budgeted Energy (MWh)" />
          <Area type="monotone" dataKey="actual" stroke="#06b6d4" fillOpacity={1} fill="url(#colorActual)" name="Actual Energy (MWh)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Revenue Comparison Chart
export function RevenueComparison({ data }: { data: any[] }) {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Revenue Comparison</h3>
        <p className="text-xs text-muted-foreground">Actual revenue versus budgeted revenue across the selected period</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
          <Legend />
          <Bar dataKey="budgeted" fill="#3b82f6" name="Budgeted Revenue (C€)" />
          <Bar dataKey="actual" fill="#06b6d4" name="Actual Revenue (C€)" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Cumulative Generation Tracker
export function CumulativeGenerationTracker({ data }: { data: any[] }) {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Cumulative Generation Tracker</h3>
        <p className="text-xs text-muted-foreground">Running total of actual vs budgeted generation over time</p>
        <div className="absolute top-6 right-6 text-red-400 text-sm font-semibold">-420.7 MWh</div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
          <Legend />
          <Line type="monotone" dataKey="budgetedCum" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" name="Cumulative Budget (MWh)" />
          <Area type="monotone" dataKey="actualCum" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} name="Cumulative Actual (MWh)" />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Daily Performance Variance Chart
export function DailyPerformanceVariance({ data }: { data: any[] }) {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Daily Performance Variance</h3>
        <p className="text-xs text-muted-foreground">Energy generation variance from budget (%) with zero-line reference</p>
        <div className="absolute top-6 right-6 text-red-400 text-sm font-semibold">Avg: -17.0%</div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
          <ReferenceLine y={0} stroke="var(--muted-foreground)" />
          <Bar dataKey="variance" name="Variance %">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.variance >= 0 ? '#10b981' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Availability Heatmap
export function AvailabilityHeatmap({ data }: { data: any[] }) {
  const sites = ['Site A', 'Site B', 'Site C'];
  const dates = Array.from(new Set(data.map(d => d.date)));
  
  const getColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-900';
    if (value >= 70) return 'bg-emerald-700';
    if (value >= 50) return 'bg-yellow-700';
    if (value >= 30) return 'bg-orange-700';
    return 'bg-red-900';
  };

  return (
    <Card className="p-6 bg-card border border-border w-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Availability Heatmap</h3>
        <p className="text-xs text-muted-foreground">Daily commercial and technical availability by site</p>
      </div>
      
      <div className="space-y-6 overflow-x-auto">
        {['COMMERCIAL PA', 'TECHNICAL PA'].map((category) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-muted-foreground mb-3">{category}</h4>
            <div className="space-y-2">
              {sites.map((site) => (
                <div key={site} className="flex gap-3">
                  <div className="w-16 text-xs font-medium text-foreground flex items-center">{site}</div>
                  <div className="flex gap-1">
                    {dates.map((date) => {
                      const value = Math.floor(Math.random() * 100);
                      return (
                        <div
                          key={`${site}-${date}`}
                          className={`w-12 h-8 flex items-center justify-center text-xs font-semibold rounded ${getColor(value)} text-foreground cursor-pointer hover:opacity-80 transition-opacity`}
                          title={`${site} - ${date}: ${value}%`}
                        >
                          {value}%
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-900 rounded"></div>
          <span className="text-muted-foreground">&gt;95%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-700 rounded"></div>
          <span className="text-muted-foreground">80-95%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-700 rounded"></div>
          <span className="text-muted-foreground">60-80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-700 rounded"></div>
          <span className="text-muted-foreground">40-60%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-900 rounded"></div>
          <span className="text-muted-foreground">&lt;40%</span>
        </div>
      </div>
    </Card>
  );
}

// Circular Progress Indicator - SVG based (no dependencies)
export function CircularProgress({ label, value, target, unit, color }: { label: string; value: number; target: number; unit: string; color: string }) {
  const percentage = Math.min((value / target) * 100, 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{value.toFixed(1)}%</p>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">Target: {target}{unit}</p>
      </div>
    </div>
  );
}
