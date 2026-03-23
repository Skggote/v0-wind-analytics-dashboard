'use client';

import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardFilters } from '@/components/DashboardFilters';
import { KPICard } from '@/components/KPICard';
import {
  PowerGenerationChart,
  TemperatureChart,
  VibrationChart,
  EfficiencyChart,
  ForecastChart,
  TurbinePerformanceScatter,
} from '@/components/DashboardCharts';
import {
  generateFarms,
  generateTurbines,
  generateSCADAData,
  calculateKPIs,
  getTimeSeriesData,
  generateForecast,
  generateAnomalies,
  Farm,
  Turbine,
} from '@/lib/mockData';
import { Zap, AlertTriangle, TrendingUp, Wrench, BarChart3, Brain, Settings, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<string>('farm-001');
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | '90days' | 'custom'>('7days');
  const [aggregation, setAggregation] = useState<'hour' | 'day' | 'week'>('day');
  const [turbineFilter, setTurbineFilter] = useState<string>('all');
  const [selectedTurbine, setSelectedTurbine] = useState<string | null>(null);

  // Ensure client-side only rendering to avoid hydration mismatch with random data
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate mock data
  const farms = useMemo(() => generateFarms(), []);
  const turbines = useMemo(() => {
    const farm = farms.find(f => f.id === selectedFarm);
    if (!farm) return [];
    return generateTurbines(farm.id, farm.turbineCount);
  }, [selectedFarm, farms]);

  const scadaData = useMemo(() => {
    if (selectedTurbine) {
      return generateSCADAData(selectedTurbine, 72);
    }
    // Average across all turbines in farm
    const allData = turbines.flatMap(t => generateSCADAData(t.id, 72));
    return allData.slice(-72);
  }, [selectedTurbine, turbines]);

  const kpis = useMemo(() => calculateKPIs(scadaData), [scadaData]);
  const timeSeriesData = useMemo(() => getTimeSeriesData(scadaData), [scadaData]);
  const forecast = useMemo(() => generateForecast(7), []);
  const anomalies = useMemo(() => generateAnomalies(turbines.length), [turbines]);

  const filteredTurbines = useMemo(() => {
    return turbines.filter(t => {
      if (turbineFilter === 'all') return true;
      return t.status === turbineFilter;
    });
  }, [turbines, turbineFilter]);

  const currentFarm = farms.find(f => f.id === selectedFarm);

  // Prevent hydration mismatch by only rendering dynamic content on client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-96 bg-card border border-border rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Wind Farm Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring and AI-powered insights for {currentFarm?.name || 'your fleet'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-primary">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Co-Pilot
            </Button>
          </div>
        </div>

        {/* Filters */}
        <DashboardFilters
          farms={farms}
          selectedFarm={selectedFarm}
          onFarmChange={setSelectedFarm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          aggregation={aggregation}
          onAggregationChange={setAggregation}
          turbineFilter={turbineFilter}
          onTurbineFilterChange={setTurbineFilter}
        />

        {/* Tabs for different dashboard sections */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health & Anomalies</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Resource Efficiency Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Resource Efficiency</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Capacity Factor"
                  value={kpis.capacity_factor}
                  unit="%"
                  format="percentage"
                  status={kpis.capacity_factor > 30 ? 'normal' : 'warning'}
                  target={35}
                  description="Actual vs rated capacity"
                  icon={<BarChart3 className="w-5 h-5" />}
                />
                <KPICard
                  title="Avg Power Output"
                  value={kpis.average_power_output}
                  unit="kW"
                  format="number"
                  description="Current production level"
                />
                <KPICard
                  title="Wind Utilization"
                  value={kpis.wind_utilization_rate}
                  unit="%"
                  format="percentage"
                  status={kpis.wind_utilization_rate > 50 ? 'normal' : 'warning'}
                  description="Time generating power"
                />
                <KPICard
                  title="Energy Sold"
                  value={kpis.energy_sold}
                  unit="MWh"
                  format="number"
                  description="Total generated energy"
                />
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PowerGenerationChart data={timeSeriesData} />
              <TemperatureChart data={timeSeriesData} />
            </div>

            {/* Reliability Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Reliability Metrics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Availability"
                  value={kpis.availability}
                  unit="%"
                  format="percentage"
                  status={kpis.availability > 98 ? 'normal' : kpis.availability > 95 ? 'warning' : 'critical'}
                  target={99}
                />
                <KPICard
                  title="MTBF"
                  value={kpis.mean_time_to_failure}
                  unit="hours"
                  format="hours"
                  description="Mean Time Between Failures"
                />
                <KPICard
                  title="MTTR"
                  value={kpis.mean_time_to_repair}
                  unit="hours"
                  format="hours"
                  description="Mean Time To Repair"
                />
                <KPICard
                  title="Uptime"
                  value={kpis.uptime}
                  unit="%"
                  format="percentage"
                  target={99.5}
                />
              </div>
            </div>

            {/* Financial Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Financial Performance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Revenue/Turbine"
                  value={kpis.revenue_per_turbine}
                  unit="USD"
                  format="currency"
                  trend={8.5}
                />
                <KPICard
                  title="Imbalance Costs"
                  value={kpis.imbalance_costs}
                  unit="USD"
                  format="currency"
                  status={kpis.imbalance_costs < 5000 ? 'normal' : 'warning'}
                  trend={-2.3}
                />
                <KPICard
                  title="Forecast Accuracy"
                  value={kpis.forecast_accuracy}
                  unit="%"
                  format="percentage"
                  target={95}
                  status={kpis.forecast_accuracy > 90 ? 'normal' : 'warning'}
                />
                <KPICard
                  title="Expected Monthly Revenue"
                  value={kpis.revenue_per_turbine * 30}
                  unit="USD"
                  format="currency"
                />
              </div>
            </div>

            {/* Vibration Chart */}
            <VibrationChart data={timeSeriesData} />
          </TabsContent>

          {/* HEALTH & ANOMALIES TAB */}
          <TabsContent value="health" className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="text-xl font-semibold">Fleet Health & Maintenance</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard
                  title="Fleet Health Score"
                  value={kpis.health_score}
                  unit="%"
                  format="percentage"
                  status={
                    kpis.health_score > 80 ? 'normal' : kpis.health_score > 60 ? 'warning' : 'critical'
                  }
                  target={90}
                />
                <KPICard
                  title="Anomaly Detection"
                  value={kpis.anomaly_detection_score}
                  unit="%"
                  format="percentage"
                  target={98}
                />
                <KPICard
                  title="RUL Prediction"
                  value={kpis.rul_prediction}
                  unit="months"
                  format="hours"
                  status={kpis.rul_prediction > 24 ? 'normal' : kpis.rul_prediction > 12 ? 'warning' : 'critical'}
                />
                <KPICard
                  title="Maintenance Risk"
                  value={kpis.maintenance_risk}
                  unit="%"
                  format="percentage"
                  status={kpis.maintenance_risk < 20 ? 'normal' : kpis.maintenance_risk < 40 ? 'warning' : 'critical'}
                />
              </div>
            </div>

            {/* Performance Scatter */}
            <TurbinePerformanceScatter
              data={filteredTurbines.slice(0, 20).map((t, idx) => ({
                name: t.name,
                efficiency: 70 + Math.random() * 25,
                health: 60 + Math.random() * 40,
                size: 100,
              }))}
            />

            {/* Active Anomalies */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Recent Anomalies ({anomalies.length})</h2>
              </div>
              <Card className="p-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {anomalies.slice(0, 10).map(anomaly => (
                    <div key={anomaly.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        anomaly.severity === 'high'
                          ? 'bg-destructive'
                          : anomaly.severity === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{anomaly.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {anomaly.turbineId} • {new Date(anomaly.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Value: {anomaly.value} ({anomaly.threshold} threshold)
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        anomaly.severity === 'high'
                          ? 'bg-destructive/20 text-destructive'
                          : anomaly.severity === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-700'
                            : 'bg-blue-500/20 text-blue-700'
                      }`}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* FORECASTING TAB */}
          <TabsContent value="forecasting" className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Power & Revenue Forecasting</h2>
              </div>
            </div>

            <ForecastChart data={forecast} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EfficiencyChart
                data={[
                  { name: 'High Efficiency', value: 35 },
                  { name: 'Normal', value: 50 },
                  { name: 'Degraded', value: 12 },
                  { name: 'Offline', value: 3 },
                ]}
              />
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-4">Forecast Insights</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded">
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      ✓ Favorable winds expected
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Wind speeds 12-15 m/s forecasted for the next 3 days
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded">
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                      ⚠ Maintenance window recommended
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                      Low wind period day 5-6 is ideal for scheduled maintenance
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded">
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      📈 Revenue opportunity
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      Expected revenue next 7 days: $142,500 (+12% vs last week)
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* DETAILS TAB */}
          <TabsContent value="details" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Turbine Fleet Details</h2>
              <Card className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Turbine</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Last Maintenance</th>
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Capacity</th>
                        <th className="text-right py-2 px-3 font-medium text-muted-foreground">Health</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTurbines.slice(0, 15).map(turbine => (
                        <tr
                          key={turbine.id}
                          className="border-b hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedTurbine(turbine.id)}
                        >
                          <td className="py-3 px-3 font-medium">{turbine.name}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                turbine.status === 'operational'
                                  ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                                  : turbine.status === 'maintenance'
                                    ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300'
                                    : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                              }`}
                            >
                              {turbine.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-muted-foreground">
                            {new Date(turbine.lastMaintenanceDate).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3">{turbine.capacity} MW</td>
                          <td className="py-3 px-3 text-right font-medium">
                            {(75 + Math.random() * 20).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
