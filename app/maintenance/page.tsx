'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/KPICard';
import { AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function MaintenancePage() {
  // RUL Data
  const rulData = [
    {
      turbine: 'T01',
      rul: 42,
      risk: 15,
      health: 92,
      lastMaintenance: '2024-02-15',
      priority: 'low',
    },
    {
      turbine: 'T05',
      rul: 8,
      risk: 78,
      health: 32,
      lastMaintenance: '2023-08-10',
      priority: 'critical',
    },
    {
      turbine: 'T12',
      rul: 3,
      risk: 92,
      health: 18,
      lastMaintenance: '2023-05-20',
      priority: 'critical',
    },
    {
      turbine: 'T15',
      rul: 18,
      risk: 55,
      health: 48,
      lastMaintenance: '2023-11-12',
      priority: 'high',
    },
    {
      turbine: 'T23',
      rul: 24,
      risk: 42,
      health: 65,
      lastMaintenance: '2024-01-08',
      priority: 'medium',
    },
  ];

  // Maintenance Schedule
  const maintenanceSchedule = [
    { date: '2024-03-25', turbine: 'T12', type: 'Urgent', duration: '2-3 days', cost: 18000, work: 'Bearing replacement' },
    { date: '2024-04-10', turbine: 'T05', type: 'Scheduled', duration: '1-2 days', cost: 12000, work: 'Pitch system maintenance' },
    { date: '2024-04-28', turbine: 'T15', type: 'Preventive', duration: '1 day', cost: 8500, work: 'Gearbox inspection' },
    { date: '2024-05-15', turbine: 'T23', type: 'Preventive', duration: '1 day', cost: 7200, work: 'Electrical system check' },
  ];

  // Degradation Trends
  const degradationData = [
    { week: 'W1', T05_health: 95, T12_health: 90, T15_health: 88 },
    { week: 'W2', T05_health: 92, T12_health: 85, T15_health: 84 },
    { week: 'W3', T05_health: 88, T12_health: 80, T15_health: 78 },
    { week: 'W4', T05_health: 82, T12_health: 75, T15_health: 72 },
    { week: 'W5', T05_health: 75, T12_health: 68, T15_health: 65 },
    { week: 'W6', T05_health: 68, T12_health: 55, T15_health: 58 },
    { week: 'W7', T05_health: 60, T12_health: 42, T15_health: 50 },
    { week: 'W8', T05_health: 52, T12_health: 32, T15_health: 48 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'high':
        return 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800';
      case 'medium':
        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'medium':
        return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default:
        return null;
    }
  };

  const criticalCount = rulData.filter(t => t.priority === 'critical').length;
  const plannedMaintenance = maintenanceSchedule.filter(m => m.type === 'Scheduled').length;
  const totalCost = maintenanceSchedule.reduce((sum, m) => sum + m.cost, 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Predictive Maintenance</h1>
          <p className="text-muted-foreground mt-1">
            RUL predictions, maintenance planning, and health monitoring
          </p>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Critical Turbines"
            value={criticalCount}
            unit="units"
            status="critical"
            icon={<AlertTriangle className="w-5 h-5" />}
          />
          <KPICard
            title="Planned Maintenance"
            value={plannedMaintenance}
            unit="tasks"
            status="normal"
            icon={<Wrench className="w-5 h-5" />}
          />
          <KPICard
            title="Maintenance Budget"
            value={totalCost}
            unit="USD"
            format="currency"
            status="normal"
          />
          <KPICard
            title="Avg Fleet Health"
            value={Math.round(rulData.reduce((sum, t) => sum + t.health, 0) / rulData.length)}
            unit="%"
            format="percentage"
            status={Math.round(rulData.reduce((sum, t) => sum + t.health, 0) / rulData.length) > 70 ? 'normal' : 'warning'}
          />
        </div>

        <Tabs defaultValue="rul" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="rul">RUL Predictions</TabsTrigger>
            <TabsTrigger value="schedule">Maintenance Schedule</TabsTrigger>
            <TabsTrigger value="degradation">Degradation Trends</TabsTrigger>
          </TabsList>

          {/* RUL Tab */}
          <TabsContent value="rul" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Remaining Useful Life (RUL) by Component</h2>
              <div className="space-y-4">
                {rulData.map((turbine, idx) => (
                  <Card key={idx} className={`p-4 border-l-4 ${getPriorityColor(turbine.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getPriorityIcon(turbine.priority)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{turbine.turbine}</h3>
                            <span className={`text-xs font-semibold px-2 py-1 rounded uppercase ${
                              turbine.priority === 'critical'
                                ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                                : turbine.priority === 'high'
                                  ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
                                  : turbine.priority === 'medium'
                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                    : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            }`}>
                              {turbine.priority}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                            <div>
                              <p className="text-muted-foreground">RUL</p>
                              <p className="font-semibold text-lg">{turbine.rul} months</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Health Score</p>
                              <p className="font-semibold">{turbine.health}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Risk Level</p>
                              <p className="font-semibold">{turbine.risk}%</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Last Maintenance</p>
                              <p className="font-semibold">{new Date(turbine.lastMaintenance).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Health Trend</span>
                              <span>{turbine.health}%</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  turbine.health > 70
                                    ? 'bg-green-500'
                                    : turbine.health > 40
                                      ? 'bg-yellow-500'
                                      : 'bg-red-500'
                                }`}
                                style={{ width: `${turbine.health}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant={turbine.priority === 'critical' ? 'default' : 'outline'}>
                        Schedule
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Planned Maintenance Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Turbine</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Work</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Cost</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceSchedule.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 font-medium">{item.turbine}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              item.type === 'Urgent'
                                ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                                : item.type === 'Scheduled'
                                  ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300'
                                  : 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{item.work}</td>
                        <td className="py-3 px-4">{item.duration}</td>
                        <td className="py-3 px-4 font-medium">${item.cost.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t text-sm font-semibold flex justify-between">
                <span>Total Maintenance Cost (Next 60 Days)</span>
                <span className="text-primary">${maintenanceSchedule.reduce((sum, m) => sum + m.cost, 0).toLocaleString()}</span>
              </div>
            </Card>
          </TabsContent>

          {/* Degradation Tab */}
          <TabsContent value="degradation">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Health Score Degradation Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={degradationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" label={{ value: 'Health %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                    formatter={(value) => `${(value as number).toFixed(0)}%`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="T05_health"
                    stroke="var(--chart-2)"
                    name="T05 (High Priority)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="T12_health"
                    stroke="var(--destructive)"
                    name="T12 (Critical)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="T15_health"
                    stroke="var(--chart-3)"
                    name="T15 (Medium Priority)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
