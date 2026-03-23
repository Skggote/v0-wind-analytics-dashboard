'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateFarms, generateTurbines, generateSCADAData, calculateKPIs, generateWeatherData } from '@/lib/mockData';
import { AlertTriangle, Activity, Zap, Wind, Thermometer } from 'lucide-react';

export default function TurbinesPage() {
  const [selectedFarm, setSelectedFarm] = useState('farm-001');
  const [selectedTurbine, setSelectedTurbine] = useState<string | null>(null);

  const farms = generateFarms();
  const turbines = useMemo(() => generateTurbines(selectedFarm, 45), [selectedFarm]);

  const selectedTurbineData = useMemo(() => {
    if (!selectedTurbine) return null;
    const scadaData = generateSCADAData(selectedTurbine, 24);
    const weatherData = generateWeatherData(selectedTurbine, 24);
    const kpis = calculateKPIs(scadaData);

    // Combine SCADA and weather for time series
    const timeSeriesData = scadaData.slice(0, 24).map((scada, idx) => ({
      time: new Date(scada.timestamp).getHours() + ':00',
      power: scada.powerOutput,
      windSpeed: scada.windSpeed,
      temperature: scada.temperature.toFixed(1),
      vibration: scada.vibration.toFixed(2),
    }));

    return { scadaData, weatherData, kpis, timeSeriesData };
  }, [selectedTurbine]);

  const turbineMetrics = useMemo(() => {
    return turbines.map(turbine => {
      const scadaData = generateSCADAData(turbine.id, 24);
      const kpis = calculateKPIs(scadaData);
      return {
        ...turbine,
        ...kpis,
      };
    });
  }, [turbines]);

  // Status badge color
  const getStatusColor = (health: number) => {
    if (health > 80) return 'bg-green-500/20 text-green-400';
    if (health > 60) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  const getStatusLabel = (health: number) => {
    if (health > 80) return 'Healthy';
    if (health > 60) return 'Degrading';
    return 'At Risk';
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Turbine Monitoring</h1>
          <p className="text-muted-foreground">Real-time health monitoring and performance analytics</p>
        </div>

        {/* Farm Selection */}
        <div className="mb-8">
          <select
            value={selectedFarm}
            onChange={(e) => {
              setSelectedFarm(e.target.value);
              setSelectedTurbine(null);
            }}
            className="w-full md:w-64 px-4 py-2 rounded-lg bg-card border border-border text-foreground"
          >
            {farms.map(farm => (
              <option key={farm.id} value={farm.id}>{farm.name}</option>
            ))}
          </select>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Turbine List */}
          <div className="lg:col-span-1">
            <Card className="p-4 max-h-[600px] overflow-y-auto">
              <h3 className="font-semibold text-foreground mb-4">Turbines ({turbines.length})</h3>
              <div className="space-y-2">
                {turbineMetrics.map(turbine => (
                  <button
                    key={turbine.id}
                    onClick={() => setSelectedTurbine(turbine.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedTurbine === turbine.id
                        ? 'bg-primary/10 border-primary'
                        : 'border-border hover:bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{turbine.name}</span>
                      <Badge className={`text-xs ${getStatusColor(turbine.health_score)}`}>
                        {getStatusLabel(turbine.health_score)}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      CF: {turbine.capacity_factor.toFixed(1)}% | Health: {turbine.health_score.toFixed(0)}%
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Turbine Details */}
          <div className="lg:col-span-2">
            {selectedTurbineData ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Power Output</span>
                      <Zap className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {selectedTurbineData.kpis.average_power_output.toFixed(0)} kW
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Capacity Factor</span>
                      <Activity className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {selectedTurbineData.kpis.capacity_factor.toFixed(1)}%
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Health Score</span>
                      <AlertTriangle className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {selectedTurbineData.kpis.health_score.toFixed(0)}%
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">RUL Prediction</span>
                      <Wind className="w-4 h-4 text-accent" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {selectedTurbineData.kpis.rul_prediction.toFixed(0)} mo
                    </div>
                  </Card>
                </div>

                {/* Time Series Charts */}
                <Card className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Power & Wind Speed (24h)</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={selectedTurbineData.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Wind Speed (m/s)', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="power" stroke="#FF6B6B" name="Power Output" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="windSpeed" stroke="#4ECDC4" name="Wind Speed" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Temperature & Vibration (24h)</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={selectedTurbineData.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Vibration (g)', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="temperature" fill="#FF6B6B" stroke="#FF6B6B" name="Temperature" opacity={0.6} />
                      <Area yAxisId="right" type="monotone" dataKey="vibration" fill="#4ECDC4" stroke="#4ECDC4" name="Vibration" opacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                {/* Performance Metrics */}
                <Card className="p-6">
                  <h4 className="font-semibold text-foreground mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { label: 'Availability', value: selectedTurbineData.kpis.availability.toFixed(1), unit: '%' },
                      { label: 'Wind Utilization', value: selectedTurbineData.kpis.wind_utilization_rate.toFixed(1), unit: '%' },
                      { label: 'Anomaly Score', value: selectedTurbineData.kpis.anomaly_detection_score.toFixed(0), unit: '%' },
                      { label: 'MTBF', value: selectedTurbineData.kpis.mean_time_to_failure.toFixed(0), unit: 'hrs' },
                      { label: 'MTTR', value: selectedTurbineData.kpis.mean_time_to_repair.toFixed(1), unit: 'hrs' },
                      { label: 'Maintenance Risk', value: selectedTurbineData.kpis.maintenance_risk.toFixed(0), unit: '%' },
                    ].map((metric, idx) => (
                      <div key={idx} className="border border-border rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">{metric.label}</div>
                        <div className="text-lg font-bold text-foreground">
                          {metric.value}
                          <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Select a turbine to view detailed analytics</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
