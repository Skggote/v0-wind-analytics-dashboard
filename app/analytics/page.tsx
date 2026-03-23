'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
} from 'recharts';
import { Download, TrendingUp, TrendingDown, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  // Real-time data for current period
  const dateRange = '24-05-2025 to 01-06-2025';

  // Wind Speed Analysis data
  const windSpeedData = [
    { date: '24-05-2025', budgeted: 10.5, actual: 9.2 },
    { date: '25-05-2025', budgeted: 11.2, actual: 10.1 },
    { date: '26-05-2025', budgeted: 9.8, actual: 11.3 },
    { date: '27-05-2025', budgeted: 10.1, actual: 9.5 },
    { date: '28-05-2025', budgeted: 12.0, actual: 11.8 },
    { date: '29-05-2025', budgeted: 11.5, actual: 12.1 },
    { date: '30-05-2025', budgeted: 10.3, actual: 10.8 },
    { date: '01-06-2025', budgeted: 9.9, actual: 11.4 },
  ];

  // Plant Load Factor data
  const plfData = [
    { date: '24-05-2025', target: 35, actual: 28 },
    { date: '25-05-2025', target: 42, actual: 38 },
    { date: '26-05-2025', target: 48, actual: 52 },
    { date: '27-05-2025', target: 55, actual: 51 },
    { date: '28-05-2025', target: 60, actual: 65 },
    { date: '29-05-2025', target: 70, actual: 75 },
    { date: '30-05-2025', target: 68, actual: 72 },
    { date: '01-06-2025', target: 65, actual: 70 },
  ];

  // Energy Generation data
  const energyData = [
    { date: '24-05-2025', budgeted: 150, actual: 120 },
    { date: '25-05-2025', budgeted: 180, actual: 165 },
    { date: '26-05-2025', budgeted: 220, actual: 240 },
    { date: '27-05-2025', budgeted: 260, actual: 280 },
    { date: '28-05-2025', budgeted: 320, actual: 380 },
    { date: '29-05-2025', budgeted: 380, actual: 450 },
    { date: '30-05-2025', budgeted: 420, actual: 520 },
    { date: '01-06-2025', budgeted: 480, actual: 600 },
  ];

  // Revenue Comparison data
  const revenueData = [
    { date: '24-05-2025', budgeted: 0.045, actual: 0.035 },
    { date: '25-05-2025', budgeted: 0.052, actual: 0.048 },
    { date: '26-05-2025', budgeted: 0.065, actual: 0.072 },
    { date: '27-05-2025', budgeted: 0.080, actual: 0.088 },
    { date: '28-05-2025', budgeted: 0.100, actual: 0.118 },
    { date: '29-05-2025', budgeted: 0.118, actual: 0.142 },
    { date: '30-05-2025', budgeted: 0.132, actual: 0.165 },
    { date: '01-06-2025', budgeted: 0.152, actual: 0.188 },
  ];

  // Daily Performance Variance
  const varianceData = [
    { date: '24-05-2025', variance: -25 },
    { date: '25-05-2025', variance: -18 },
    { date: '26-05-2025', variance: 12 },
    { date: '27-05-2025', variance: -8 },
    { date: '28-05-2025', variance: 28 },
    { date: '29-05-2025', variance: 35 },
    { date: '30-05-2025', variance: 18 },
    { date: '01-06-2025', variance: 8 },
  ];

  // Cumulative Generation data
  const cumulativeData = [
    { date: '24-05-2025', budgeted: 150, actual: 120 },
    { date: '25-05-2025', budgeted: 330, actual: 285 },
    { date: '26-05-2025', budgeted: 550, actual: 525 },
    { date: '27-05-2025', budgeted: 810, actual: 805 },
    { date: '28-05-2025', budgeted: 1130, actual: 1185 },
    { date: '29-05-2025', budgeted: 1510, actual: 1635 },
    { date: '30-05-2025', budgeted: 1930, actual: 2155 },
    { date: '01-06-2025', budgeted: 2410, actual: 2755 },
  ];

  // Wind Speed Distribution
  const windDistribution = [
    { range: '0-4 m/s', frequency: 2 },
    { range: '4-6 m/s', frequency: 3 },
    { range: '6-8 m/s', frequency: 8 },
    { range: '8-10 m/s', frequency: 3 },
    { range: '10-12 m/s', frequency: 2 },
    { range: '12+ m/s', frequency: 1 },
  ];

  // Availability Heatmap data
  const heatmapData = [
    {
      site: 'Site A',
      type: 'COMMERCIAL PA',
      dates: [
        { date: '22-05-2025', value: 95, color: 'bg-red-700' },
        { date: '23-05-2025', value: 81, color: 'bg-green-600' },
        { date: '24-05-2025', value: 88, color: 'bg-green-600' },
        { date: '25-05-2025', value: 92, color: 'bg-green-600' },
        { date: '26-05-2025', value: 6, color: 'bg-red-700' },
        { date: '27-05-2025', value: 8, color: 'bg-red-700' },
        { date: '28-05-2025', value: 8, color: 'bg-red-700' },
        { date: '29-05-2025', value: 8, color: 'bg-red-700' },
        { date: '30-05-2025', value: 8, color: 'bg-red-700' },
        { date: '31-05-2025', value: 9, color: 'bg-red-700' },
      ],
    },
    {
      site: 'Site B',
      type: 'COMMERCIAL PA',
      dates: [
        { date: '22-05-2025', value: 0, color: 'bg-red-700' },
        { date: '23-05-2025', value: 4, color: 'bg-red-700' },
        { date: '24-05-2025', value: 0, color: 'bg-red-700' },
        { date: '25-05-2025', value: 0, color: 'bg-red-700' },
        { date: '26-05-2025', value: 94, color: 'bg-green-600' },
        { date: '27-05-2025', value: 100, color: 'bg-green-600' },
        { date: '28-05-2025', value: 100, color: 'bg-green-600' },
        { date: '29-05-2025', value: 148, color: 'bg-green-600' },
        { date: '30-05-2025', value: 0, color: 'bg-red-700' },
        { date: '31-05-2025', value: 0, color: 'bg-red-700' },
      ],
    },
    {
      site: 'Site C',
      type: 'COMMERCIAL PA',
      dates: [
        { date: '22-05-2025', value: 0, color: 'bg-red-700' },
        { date: '23-05-2025', value: 0, color: 'bg-red-700' },
        { date: '24-05-2025', value: 0, color: 'bg-red-700' },
        { date: '25-05-2025', value: 0, color: 'bg-red-700' },
        { date: '26-05-2025', value: 0, color: 'bg-red-700' },
        { date: '27-05-2025', value: 0, color: 'bg-red-700' },
        { date: '28-05-2025', value: 0, color: 'bg-red-700' },
        { date: '29-05-2025', value: 0, color: 'bg-red-700' },
        { date: '30-05-2025', value: 0, color: 'bg-red-700' },
        { date: '31-05-2025', value: 128, color: 'bg-green-600' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              Real-time monitoring & analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
              🟢 Live
            </Badge>
            <Button className="gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Main Analytics Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="variance">Variance</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Wind Speed & PLF */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Wind Speed Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Budgeted vs actual wind speed during the selected period
                    </p>
                  </div>
                  <Badge variant="secondary">11.08 m/s</Badge>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={windSpeedData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--muted-foreground)" 
                      style={{ fontSize: '11px' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '11px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                      formatter={(value) => `${(value as number).toFixed(1)} m/s`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="budgeted"
                      stroke="#f59e0b"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Budgeted Wind Speed (m/s)"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Actual Wind Speed (m/s)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Plant Load Factor (PLF)</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Target vs actual PLF trends across the selected date range
                    </p>
                  </div>
                  <Badge variant="secondary">100%</Badge>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={plfData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--muted-foreground)" 
                      style={{ fontSize: '11px' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '11px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                      formatter={(value) => `${(value as number).toFixed(0)}%`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#f59e0b"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Target PLF (%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Actual PLF (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab - Energy & Revenue */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Energy Generation Trends</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Actual vs budgeted energy generation over the selected period
                    </p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-600 border-0">86.2% achieved</Badge>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={energyData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBudgeted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--muted-foreground)" 
                      style={{ fontSize: '11px' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '11px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                      formatter={(value) => `${(value as number).toFixed(0)} MWh`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="budgeted"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="url(#colorBudgeted)"
                      name="Budgeted Energy (MWh)"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stackId="2"
                      stroke="#06b6d4"
                      fill="url(#colorActual)"
                      name="Actual Energy (MWh)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Revenue Comparison</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Actual revenue versus budgeted revenue across the selected period
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={revenueData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--muted-foreground)" 
                      style={{ fontSize: '11px' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '11px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                      formatter={(value) => `₹${(value as number).toFixed(3)} Cr.`}
                    />
                    <Legend />
                    <Bar dataKey="budgeted" fill="#3b82f6" name="Budgeted Revenue (Cr.)" />
                    <Bar dataKey="actual" fill="#06b6d4" name="Actual Revenue (Cr.)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6 bg-card/50 border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Cumulative Generation Tracker</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Running total of actual vs budgeted generation over time
                  </p>
                </div>
                <Badge className="bg-red-500/20 text-red-600 border-0">-429.7 MWh</Badge>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={cumulativeData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCumBudgeted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCumActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--muted-foreground)" 
                    style={{ fontSize: '11px' }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '11px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    formatter={(value) => `${(value as number).toFixed(0)} MWh`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="budgeted"
                    stroke="#3b82f6"
                    fill="url(#colorCumBudgeted)"
                    strokeWidth={2}
                    name="Cumulative Budget (MWh)"
                    strokeDasharray="5 5"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#06b6d4"
                    fill="url(#colorCumActual)"
                    strokeWidth={2}
                    name="Cumulative Actual (MWh)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Variance Tab */}
          <TabsContent value="variance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Daily Performance Variance</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Energy generation variance from budget (%) with zero-line reference
                    </p>
                  </div>
                  <Badge className="bg-red-500/20 text-red-600 border-0">Avg: -17.0%</Badge>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={varianceData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="var(--muted-foreground)" 
                      style={{ fontSize: '11px' }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '11px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                      formatter={(value) => `${(value as number).toFixed(1)}%`}
                    />
                    <Bar dataKey="variance" name="Variance (%)">
                      {varianceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.variance >= 0 ? '#16a34a' : '#dc2626'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card/50 border-border/50">
                <h3 className="text-lg font-semibold mb-4">Revenue Loss Waterfall</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Breakdown of revenue from budget to actual, showing loss categories
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Budgeted Revenue</span>
                      <span className="font-semibold text-blue-500">₹0.9000 Cr.</span>
                    </div>
                    <div className="h-8 bg-blue-500 rounded flex items-center px-3 text-white text-xs font-medium">
                      ₹0.9000 Cr.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wind Loss</span>
                      <span className="font-semibold text-red-500">-₹0.1100 Cr.</span>
                    </div>
                    <div className="h-6 bg-red-500 rounded flex items-center px-3 text-white text-xs font-medium">
                      -₹0.1100 Cr.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Performance Gap</span>
                      <span className="font-semibold text-red-500">-₹0.0200 Cr.</span>
                    </div>
                    <div className="h-6 bg-red-500 rounded flex items-center px-3 text-white text-xs font-medium">
                      -₹0.0200 Cr.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Variance</span>
                      <span className="font-semibold text-green-500">+₹0.0400 Cr.</span>
                    </div>
                    <div className="h-6 bg-green-500 rounded flex items-center px-3 text-white text-xs font-medium">
                      +₹0.0400 Cr.
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Actual Revenue</span>
                      <span className="font-bold text-green-500">₹0.7700 Cr.</span>
                    </div>
                    <div className="h-8 bg-green-500 rounded flex items-center px-3 text-white text-xs font-medium mt-2">
                      ₹0.7700 Cr.
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2">
                    Total Variance: <span className="font-semibold text-red-500">-₹0.1300 Cr. (85.6% of budget)</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Heatmap Tab */}
          <TabsContent value="heatmap" className="space-y-6">
            <Card className="p-6 bg-card/50 border-border/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Availability Heatmap</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Daily commercial and technical PA availability by site
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Avg. Comm:</span>
                    <span className="font-semibold">98%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Avg. Tech:</span>
                    <span className="font-semibold">82.2%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {heatmapData.map((siteData, siteIdx) => (
                  <div key={siteIdx}>
                    <h4 className="text-sm font-semibold mb-3">{siteData.site} - {siteData.type}</h4>
                    <div className="overflow-x-auto pb-2">
                      <div className="flex gap-1 min-w-max">
                        {siteData.dates.map((cell, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1">
                            <div
                              className={`w-12 h-12 rounded flex items-center justify-center text-xs font-semibold text-white ${cell.color}`}
                            >
                              {cell.value}%
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {cell.date.split('-').slice(0, 2).join('-')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Legend</h4>
                <div className="flex flex-wrap gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-600 rounded"></div>
                    <span>80%-100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-600 rounded"></div>
                    <span>60%-80%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-orange-600 rounded"></div>
                    <span>40%-60%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-700 rounded"></div>
                    <span>{'>40%'}</span>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Distribution Tab */}
          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Wind Speed Distribution</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Frequency distribution of observed wind speeds
                    </p>
                  </div>
                  <Badge variant="secondary">Peak: 6.8 a/s (66.7%)</Badge>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={windDistribution} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis 
                      dataKey="range" 
                      stroke="var(--muted-foreground)" 
                      style={{ fontSize: '11px' }}
                    />
                    <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '11px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    />
                    <Bar dataKey="frequency" fill="#06b6d4" name="Frequency" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6 bg-card/50 border-border/50">
                <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Total Generated</span>
                    <span className="text-xl font-bold text-cyan-500">2,755 MWh</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Budgeted</span>
                    <span className="text-xl font-bold">2,410 MWh</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Variance</span>
                    <span className="text-xl font-bold text-green-500">+345 MWh</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <span className="text-sm text-muted-foreground">Average Wind Speed</span>
                    <span className="text-xl font-bold">10.6 m/s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Peak Generation</span>
                    <span className="text-xl font-bold text-cyan-500">600 MWh</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
