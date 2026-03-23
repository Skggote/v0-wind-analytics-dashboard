'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { ArrowLeft, Wind, Zap, TrendingUp, Calendar } from 'lucide-react';

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  const siteName = searchParams.get('name') || `Site ${params.id.toUpperCase()}`;
  const capacity = parseFloat(searchParams.get('capacity') || '0');
  const generation = parseFloat(searchParams.get('generation') || '0');
  const revenue = parseFloat(searchParams.get('revenue') || '0');

  // Mock data for site details
  const dailyPerformance = [
    { date: '24-05', generation: 45, budget: 50, revenue: 0.12 },
    { date: '25-05', generation: 52, budget: 48, revenue: 0.15 },
    { date: '26-05', generation: 58, budget: 55, revenue: 0.18 },
    { date: '27-05', generation: 65, budget: 60, revenue: 0.22 },
    { date: '28-05', generation: 72, budget: 68, revenue: 0.28 },
    { date: '29-05', generation: 85, budget: 80, revenue: 0.35 },
    { date: '30-05', generation: 92, budget: 90, revenue: 0.42 },
    { date: '01-06', generation: 95, budget: 88, revenue: 0.45 },
  ];

  const turbinePerformance = [
    { name: 'Turbine 1', generation: 45, availability: 95, status: 'Healthy' },
    { name: 'Turbine 2', generation: 48, availability: 98, status: 'Healthy' },
    { name: 'Turbine 3', generation: 42, availability: 87, status: 'Degraded' },
    { name: 'Turbine 4', generation: 50, availability: 100, status: 'Healthy' },
    { name: 'Turbine 5', generation: 46, availability: 92, status: 'Healthy' },
  ];

  const windSpeedData = [
    { time: '00:00', speed: 8.2 },
    { time: '04:00', speed: 7.5 },
    { time: '08:00', speed: 9.1 },
    { time: '12:00', speed: 10.2 },
    { time: '16:00', speed: 11.5 },
    { time: '20:00', speed: 9.8 },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-96 bg-card border border-border rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sites
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">{siteName}</h1>
              <p className="text-muted-foreground">
                Detailed performance metrics and real-time monitoring
              </p>
            </div>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
              Active
            </Badge>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-card/50 border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Total Capacity</p>
            <p className="text-3xl font-bold text-primary mb-1">{capacity} MW</p>
            <p className="text-xs text-muted-foreground">Installed Capacity</p>
          </Card>
          <Card className="p-6 bg-card/50 border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Total Generation</p>
            <p className="text-3xl font-bold text-primary mb-1">{generation} MWh</p>
            <p className="text-xs text-muted-foreground">Current Period</p>
          </Card>
          <Card className="p-6 bg-card/50 border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Revenue</p>
            <p className="text-3xl font-bold text-primary mb-1">₹{revenue.toFixed(2)} Cr.</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </Card>
          <Card className="p-6 bg-card/50 border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Avg. PLF</p>
            <p className="text-3xl font-bold text-primary mb-1">
              {(generation / capacity / 8).toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Capacity Factor</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Daily Performance */}
          <Card className="p-6 bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Daily Performance Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={dailyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                <YAxis yAxisId="left" stroke="var(--muted-foreground)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="generation"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  name="Actual Generation"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="budget"
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Budgeted Generation"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Wind Speed Trend */}
          <Card className="p-6 bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Wind Speed Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={windSpeedData}>
                <defs>
                  <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="time" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                <Area
                  type="monotone"
                  dataKey="speed"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSpeed)"
                  name="Wind Speed (m/s)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Turbine Performance Table */}
        <Card className="p-6 bg-card/50 border-border/50 mb-6">
          <h3 className="text-lg font-semibold mb-6">Turbine-wise Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Turbine</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Generation (MWh)</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Availability (%)</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {turbinePerformance.map((turbine, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border hover:bg-card/50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/turbines?turbine=${turbine.name}`)}
                  >
                    <td className="py-4 px-4 font-medium">{turbine.name}</td>
                    <td className="py-4 px-4">{turbine.generation} MWh</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${turbine.availability}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold">{turbine.availability}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="outline"
                        className={
                          turbine.status === 'Healthy'
                            ? 'bg-green-500/10 text-green-600 border-green-500/30'
                            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
                        }
                      >
                        {turbine.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Alerts and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5"></div>
                <div>
                  <p className="font-medium text-sm">Turbine 3 Performance Degradation</p>
                  <p className="text-xs text-muted-foreground">Generation below threshold</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <p className="font-medium text-sm">Scheduled Maintenance - Site A</p>
                  <p className="text-xs text-muted-foreground">Planned for next week</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 border-border/50">
            <h3 className="text-lg font-semibold mb-4">Insights & Recommendations</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Revenue target on track for current period</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span>Wind conditions optimal - above average speeds</span>
              </div>
              <div className="flex gap-3">
                <span className="text-yellow-600 font-bold">!</span>
                <span>Turbine 3 requires maintenance check</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">→</span>
                <span>Consider predictive maintenance for long-term optimization</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
