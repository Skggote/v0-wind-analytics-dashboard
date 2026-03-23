'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateSites, generateFarms, generateSCADAData, calculateKPIs } from '@/lib/mockData';
import { ChevronRight, MapPin, Zap, Wind, TrendingUp, TrendingDown } from 'lucide-react';

export default function SitesPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const sites = generateSites();
  const farms = generateFarms();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const siteMetrics = useMemo(() => {
    return sites.map(site => {
      const siteFarms = farms.filter(f => site.farms.includes(f.id));
      let totalCapacityFactor = 0;
      let totalAvailability = 0;
      let commercialAvail = 0;
      let technicalAvail = 0;
      let turbineCount = 0;

      siteFarms.forEach(farm => {
        for (let i = 0; i < 5; i++) {
          const scadaData = generateSCADAData(`turbine-${farm.id}-001`, 24);
          const kpis = calculateKPIs(scadaData);
          totalCapacityFactor += kpis.capacity_factor;
          totalAvailability += kpis.availability;
          turbineCount++;
        }
      });

      // Simulate revenue and wind speed
      const generation = (totalCapacityFactor / turbineCount) * site.totalCapacity;
      const revenue = (generation / 100) * 0.35; // 0.35 Cr per 100 MWh
      const avgWindSpeed = 6.5 + Math.random() * 2;
      commercialAvail = 80 + Math.random() * 20;
      technicalAvail = 70 + Math.random() * 25;

      return {
        ...site,
        generation: Math.round(generation),
        revenue: revenue.toFixed(2),
        avgCapacityFactor: totalCapacityFactor / turbineCount,
        avgAvailability: totalAvailability / turbineCount,
        avgWindSpeed: avgWindSpeed.toFixed(1),
        commercialAvail: Math.round(commercialAvail),
        technicalAvail: Math.round(technicalAvail),
        variance: (Math.random() * 400 - 200).toFixed(1),
      };
    });
  }, []);

  // Data for comparison chart
  const comparisonData = siteMetrics.map(site => ({
    name: site.name,
    budgeted: site.totalCapacity * 365 * 0.35, // Budgeted annual energy
    actual: site.generation,
  }));

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
          <h1 className="text-3xl font-bold tracking-tight mb-2">Site Comparison</h1>
          <p className="text-muted-foreground">
            Cross-site performance benchmarking with energy, revenue, and availability metrics.
          </p>
        </div>

        {/* Comparison Chart */}
        <Card className="p-6 mb-8 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Site-wise Energy Comparison</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Actual vs budgeted energy generation across all wind farm sites
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" label={{ value: 'MWh', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                formatter={(value) => `${(value as number).toFixed(0)} MWh`}
              />
              <Bar dataKey="budgeted" fill="#3b82f6" name="Budget Energy (MWh)" />
              <Bar dataKey="actual" fill="#06b6d4" name="Actual Energy (MWh)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Site Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {siteMetrics.map(site => {
            const varianceNum = parseFloat(site.variance);
            const isPositive = varianceNum >= 0;

            return (
              <Card
                key={site.id}
                className="p-6 bg-card/50 border-border/50 hover:border-border cursor-pointer transition-all hover:shadow-lg"
                onClick={() => router.push(`/sites/${site.id}?name=${encodeURIComponent(site.name)}&capacity=${site.totalCapacity}&generation=${site.generation}&revenue=${site.revenue}`)}
              >
                {/* Header with Status */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isPositive ? '#10b981' : '#ef4444' }}></div>
                    <h3 className="text-lg font-semibold">{site.name}</h3>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      isPositive
                        ? 'bg-green-500/10 text-green-600 border-green-500/30'
                        : 'bg-red-500/10 text-red-600 border-red-500/30'
                    }
                  >
                    {isPositive ? '+' : ''}{site.variance}%
                  </Badge>
                </div>

                {/* Main Metrics */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Generation</p>
                      <p className="text-2xl font-bold">{site.generation}</p>
                      <p className="text-xs text-muted-foreground">MWh</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                      <p className="text-2xl font-bold">₹{site.revenue}</p>
                      <p className="text-xs text-muted-foreground">Cr.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Avg. PLF</p>
                        <p className="text-sm font-semibold">{site.avgCapacityFactor.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Avg. Wind Speed</p>
                        <p className="text-sm font-semibold">{site.avgWindSpeed} m/s</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium">Commercial Avail.</p>
                      <p className="text-xs font-semibold">{site.commercialAvail}%</p>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${site.commercialAvail}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium">Technical Avail.</p>
                      <p className="text-xs font-semibold">{site.technicalAvail}%</p>
                    </div>
                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full"
                        style={{ width: `${site.technicalAvail}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated: {new Date().toLocaleDateString()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Summary Stats */}
        <Card className="p-6 bg-card/50 border-border/50">
          <h3 className="text-lg font-semibold mb-6">Portfolio Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Sites</p>
              <p className="text-3xl font-bold text-primary">{siteMetrics.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Capacity</p>
              <p className="text-3xl font-bold text-primary">
                {siteMetrics.reduce((sum, s) => sum + s.totalCapacity, 0)} MW
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total Generation</p>
              <p className="text-3xl font-bold text-primary">
                {siteMetrics.reduce((sum, s) => sum + s.generation, 0)} MWh
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Avg. Capacity Factor</p>
              <p className="text-3xl font-bold text-primary">
                {(siteMetrics.reduce((sum, s) => sum + s.avgCapacityFactor, 0) / siteMetrics.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
