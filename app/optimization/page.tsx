'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/KPICard';
import { TrendingUp, Zap, DollarSign, AlertCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OptimizationPage() {
  // What-if simulation data
  const simulationData = [
    {
      scenario: 'Current',
      revenue: 425000,
      efficiency: 31.2,
      maintenance_cost: 45000,
      net_revenue: 380000,
    },
    {
      scenario: 'Optimized Dispatch',
      revenue: 456000,
      efficiency: 33.5,
      maintenance_cost: 45000,
      net_revenue: 411000,
    },
    {
      scenario: 'Predictive Maintenance',
      revenue: 425000,
      efficiency: 31.2,
      maintenance_cost: 32000,
      net_revenue: 393000,
    },
    {
      scenario: 'Both + Forecast',
      revenue: 480000,
      efficiency: 35.1,
      maintenance_cost: 28000,
      net_revenue: 452000,
    },
  ];

  const efficiencyGains = [
    {
      measure: 'Improve blade pitch control',
      currentValue: 2.1,
      potentialValue: 3.5,
      implementation: '3 weeks',
    },
    {
      measure: 'Optimize yaw alignment',
      currentValue: 1.8,
      potentialValue: 2.9,
      implementation: '2 weeks',
    },
    {
      measure: 'Reduce parasitic losses',
      currentValue: 0.9,
      potentialValue: 1.4,
      implementation: '4 weeks',
    },
    {
      measure: 'Predictive curtailment',
      currentValue: 0.5,
      potentialValue: 1.2,
      implementation: '6 weeks',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Performance Optimization</h1>
          <p className="text-muted-foreground mt-1">
            What-if analysis and optimization recommendations
          </p>
        </div>

        <Tabs defaultValue="scenarios" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="measures">Efficiency Measures</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">What-If Scenario Analysis</h2>
              <Card className="p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="scenario" stroke="var(--muted-foreground)" />
                    <YAxis stroke="var(--muted-foreground)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                    <Legend />
                    <Bar dataKey="revenue" fill="var(--chart-1)" />
                    <Bar dataKey="maintenance_cost" fill="var(--chart-2)" />
                    <Bar dataKey="net_revenue" fill="var(--chart-3)" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Scenario Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simulationData.map((scenario, idx) => (
                <Card key={idx} className="p-4">
                  <h3 className="font-semibold mb-3">{scenario.scenario}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Revenue</span>
                      <span className="font-medium">${scenario.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b">
                      <span className="text-muted-foreground">Efficiency</span>
                      <span className="font-medium">{scenario.efficiency.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maintenance Cost</span>
                      <span className="font-medium">${scenario.maintenance_cost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-semibold">
                      <span>Net Revenue</span>
                      <span className="text-primary">${scenario.net_revenue.toLocaleString()}</span>
                    </div>
                    {idx > 0 && (
                      <div className="text-xs text-green-600 dark:text-green-400 pt-2">
                        +${(scenario.net_revenue - simulationData[0].net_revenue).toLocaleString()} vs Current
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Efficiency Measures Tab */}
          <TabsContent value="measures" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Efficiency Improvement Measures</h2>
              <div className="space-y-4">
                {efficiencyGains.map((measure, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{measure.measure}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Implementation: {measure.implementation}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Simulate
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current: {measure.currentValue.toFixed(1)}% capacity</span>
                        <span>Potential: {measure.potentialValue.toFixed(1)}% capacity</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full"
                          style={{
                            width: `${(measure.currentValue / measure.potentialValue) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                        Potential gain: +{(measure.potentialValue - measure.currentValue).toFixed(1)}%
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">AI-Powered Recommendations</h2>
              <div className="space-y-4">
                <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-900 dark:text-green-200">
                        Implement Advanced Control Strategy
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                        Deploy machine learning-based pitch control optimization to improve energy capture by 2-3%.
                        Expected ROI: 140% in first year.
                      </p>
                      <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                        Optimize Energy Dispatch Strategy
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                        Use predictive forecasting to optimize day-ahead bids and reduce imbalance costs.
                        Potential savings: $24,000/month.
                      </p>
                      <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">
                        View Strategy
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                        Predictive Maintenance Program
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
                        Implement AI-based predictive maintenance to reduce unplanned downtime and maintenance costs.
                        Savings: $15,000/month.
                      </p>
                      <Button size="sm" className="mt-3 bg-yellow-600 hover:bg-yellow-700">
                        Start Program
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
