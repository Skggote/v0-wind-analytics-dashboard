'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from 'recharts';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';

export default function AnalyticsPage() {
  // Monthly trend data
  const monthlyData = [
    { month: 'Jan', revenue: 380000, capacity: 29.2, maintenance_cost: 45000 },
    { month: 'Feb', revenue: 395000, capacity: 30.5, maintenance_cost: 42000 },
    { month: 'Mar', revenue: 410000, capacity: 31.8, maintenance_cost: 48000 },
    { month: 'Apr', revenue: 425000, capacity: 32.1, maintenance_cost: 45000 },
    { month: 'May', revenue: 440000, capacity: 33.5, maintenance_cost: 50000 },
    { month: 'Jun', revenue: 455000, capacity: 34.2, maintenance_cost: 43000 },
  ];

  // KPI trends
  const kpiTrends = [
    { metric: 'Revenue', value: '+12.5%', trend: 'up', color: 'text-green-600 dark:text-green-400' },
    { metric: 'Efficiency', value: '+4.2%', trend: 'up', color: 'text-green-600 dark:text-green-400' },
    { metric: 'Maintenance Costs', value: '-8.3%', trend: 'down', color: 'text-green-600 dark:text-green-400' },
    { metric: 'Downtime', value: '-2.1%', trend: 'down', color: 'text-green-600 dark:text-green-400' },
  ];

  // Anomaly trends
  const anomalyTrends = [
    { month: 'Jan', count: 12, resolved: 11 },
    { month: 'Feb', count: 9, resolved: 9 },
    { month: 'Mar', count: 15, resolved: 14 },
    { month: 'Apr', count: 8, resolved: 8 },
    { month: 'May', count: 6, resolved: 6 },
    { month: 'Jun', count: 5, resolved: 5 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Reporting</h1>
            <p className="text-muted-foreground mt-1">
              Historical trends and performance analysis
            </p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* KPI Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {kpiTrends.map((item, idx) => (
            <Card key={idx} className="p-4">
              <p className="text-sm text-muted-foreground mb-2">{item.metric}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{item.value}</span>
                {item.trend === 'up' ? (
                  <TrendingUp className={`w-5 h-5 ${item.color}`} />
                ) : (
                  <TrendingDown className={`w-5 h-5 ${item.color}`} />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">vs last 6 months</p>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          </TabsList>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card className="p-4 mb-6">
              <h3 className="text-sm font-semibold mb-4">Monthly Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    formatter={(value) => `$${(value as number).toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--chart-1)"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-4">Revenue vs Maintenance Costs</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis yAxisId="left" stroke="var(--muted-foreground)" />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    fill="var(--chart-1)"
                    stroke="var(--chart-1)"
                    fillOpacity={0.3}
                    name="Revenue"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="maintenance_cost"
                    stroke="var(--chart-2)"
                    name="Maintenance Cost"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Efficiency Tab */}
          <TabsContent value="efficiency">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-4">Capacity Factor Trend</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    formatter={(value) => `${(value as number).toFixed(1)}%`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="capacity"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    dot={{ fill: 'var(--chart-1)', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Capacity Factor"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-4">Maintenance Costs & ROI</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Legend />
                  <Bar dataKey="maintenance_cost" fill="var(--chart-2)" name="Maintenance Cost" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Anomalies Tab */}
          <TabsContent value="anomalies">
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-4">Anomaly Detection & Resolution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={anomalyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                  <Legend />
                  <Bar dataKey="count" fill="var(--chart-2)" name="Anomalies Detected" />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="var(--chart-1)"
                    name="Resolved"
                    strokeWidth={2}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Detailed Metrics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Performance Summary (Last 6 Months)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">Total Revenue</span>
                <span className="font-semibold">$2,505,000</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">Avg Capacity Factor</span>
                <span className="font-semibold">31.9%</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">Total Maintenance Costs</span>
                <span className="font-semibold">$273,000</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">Anomalies Detected</span>
                <span className="font-semibold">55</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-semibold text-primary">
                <span>Net Profit</span>
                <span>$2,232,000</span>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4">Key Insights</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Steady revenue growth (+20% YoY average)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Maintenance costs decreasing (-8% trend)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span>Anomaly resolution rate: 96% (improved from 90%)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">!</span>
                <span>Capacity factor plateau - optimize controls</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
