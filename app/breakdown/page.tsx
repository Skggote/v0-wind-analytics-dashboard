'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import { generateFarms, generateTurbines, generateSCADAData, calculateKPIs, generateEnergyLosses } from '@/lib/mockData';
import { Filter, Download, TrendingDown } from 'lucide-react';

export default function BreakdownPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<string>('farm-001');
  const [breakdownBy, setBreakdownBy] = useState<'turbine' | 'weather' | 'loss'>('loss');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const farms = generateFarms();
  const turbines = useMemo(() => generateTurbines(selectedFarm, 45), [selectedFarm]);

  // Loss breakdown data
  const lossData = useMemo(() => {
    const losses = { environmental: 0, technical: 0, operational: 0 };
    turbines.slice(0, 10).forEach(turbine => {
      generateEnergyLosses(turbine.id, 24).forEach(loss => {
        losses[loss.category] += loss.value;
      });
    });
    
    return [
      { name: 'Environmental', value: losses.environmental, fill: '#FF6B6B' },
      { name: 'Technical', value: losses.technical, fill: '#4ECDC4' },
      { name: 'Operational', value: losses.operational, fill: '#95E1D3' },
    ].filter(item => item.value > 0);
  }, [turbines]);

  // Turbine performance comparison
  const turbinePerformance = useMemo(() => {
    return turbines.slice(0, 15).map(turbine => {
      const scadaData = generateSCADAData(turbine.id, 24);
      const kpis = calculateKPIs(scadaData);
      return {
        id: turbine.name,
        capacity_factor: kpis.capacity_factor,
        availability: kpis.availability,
        health: kpis.health_score,
      };
    });
  }, [turbines]);

  // Weather impact analysis
  const weatherImpact = useMemo(() => {
    const data = [];
    for (let speed = 2; speed <= 25; speed += 2) {
      const power = speed >= 3 && speed <= 12
        ? (Math.pow(speed - 3, 3) / Math.pow(12 - 3, 3)) * 3000
        : speed > 12 && speed < 25
        ? 3000
        : 0;
      
      data.push({
        windSpeed: speed,
        expectedPower: power,
        efficiency: (power / 3000 * 100).toFixed(1),
      });
    }
    return data;
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Performance Breakdown</h1>
          <p className="text-muted-foreground">Analyze performance metrics by turbine, weather, and energy loss categories</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 flex gap-2">
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-card border border-border text-foreground"
            >
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>{farm.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            {(['loss', 'turbine', 'weather'] as const).map(type => (
              <Button
                key={type}
                variant={breakdownBy === type ? 'default' : 'outline'}
                onClick={() => setBreakdownBy(type)}
                className="capitalize"
              >
                {type === 'loss' ? 'Energy Loss' : type === 'turbine' ? 'Turbine' : 'Weather'}
              </Button>
            ))}
          </div>

          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Loss Breakdown */}
          {breakdownBy === 'loss' && (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-accent" />
                  Energy Loss Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={lossData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)} MWh`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {lossData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${parseFloat(value).toFixed(2)} MWh`} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Loss Categories Detail</h3>
                <div className="space-y-4">
                  {lossData.map((loss, idx) => (
                    <div key={idx} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{loss.name}</span>
                        <span className="text-2xl font-bold text-primary">{loss.value.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(loss.value / Math.max(...lossData.map(l => l.value))) * 100}%`,
                            backgroundColor: loss.fill,
                          }}
                        />
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {((loss.value / lossData.reduce((s, l) => s + l.value, 0)) * 100).toFixed(1)}% of total loss
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Turbine Comparison */}
          {breakdownBy === 'turbine' && (
            <>
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-foreground mb-4">Turbine Performance Comparison</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={turbinePerformance} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="id" angle={-45} textAnchor="end" height={100} tick={{ fontSize: 12 }} />
                    <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="capacity_factor" fill="#FF6B6B" name="Capacity Factor" />
                    <Bar dataKey="availability" fill="#4ECDC4" name="Availability" />
                    <Bar dataKey="health" fill="#95E1D3" name="Health Score" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}

          {/* Weather Impact */}
          {breakdownBy === 'weather' && (
            <>
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-foreground mb-4">Wind Speed vs Power Output</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={weatherImpact} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="windSpeed" 
                      label={{ value: 'Wind Speed (m/s)', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      label={{ value: 'Efficiency (%)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="expectedPower" 
                      stroke="#FF6B6B" 
                      name="Power Output"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
        </div>

        {/* Detailed Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 font-semibold text-foreground">Turbine</th>
                  <th className="text-right py-2 px-4 font-semibold text-foreground">Capacity Factor</th>
                  <th className="text-right py-2 px-4 font-semibold text-foreground">Availability</th>
                  <th className="text-right py-2 px-4 font-semibold text-foreground">Health Score</th>
                  <th className="text-right py-2 px-4 font-semibold text-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {turbinePerformance.map((turbine, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-card/50">
                    <td className="py-3 px-4 text-foreground font-medium">{turbine.id}</td>
                    <td className="py-3 px-4 text-right text-foreground">{turbine.capacity_factor.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right text-foreground">{turbine.availability.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right text-foreground">{turbine.health.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        turbine.health > 80 ? 'bg-green-500/20 text-green-400' :
                        turbine.health > 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {turbine.health > 80 ? 'Good' : turbine.health > 60 ? 'Fair' : 'Poor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
