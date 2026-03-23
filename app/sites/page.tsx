'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { generateSites, generateFarms, generateSCADAData, calculateKPIs } from '@/lib/mockData';
import { ChevronRight, Search, MapPin, Zap, TrendingUp } from 'lucide-react';

export default function SitesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const sites = generateSites();
  const farms = generateFarms();

  const filteredSites = useMemo(() => {
    return sites.filter(site =>
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const siteMetrics = useMemo(() => {
    return filteredSites.map(site => {
      const siteFarms = farms.filter(f => site.farms.includes(f.id));
      let totalCapacityFactor = 0;
      let totalAvailability = 0;
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

      return {
        ...site,
        avgCapacityFactor: totalCapacityFactor / turbineCount,
        avgAvailability: totalAvailability / turbineCount,
      };
    });
  }, [filteredSites]);

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Sites Directory</h1>
          <p className="text-muted-foreground">Manage and monitor all wind energy sites in your portfolio</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search sites by name or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {siteMetrics.map(site => (
            <Link key={site.id} href={`/sites/${site.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{site.name}</h2>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        {site.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Owner</div>
                      <div className="text-sm font-semibold text-foreground">{site.owner}</div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-border">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Capacity</div>
                      <div className="text-lg font-bold text-primary">{site.totalCapacity} MW</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Turbines</div>
                      <div className="text-lg font-bold text-primary">{site.totalTurbines}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Farms</div>
                      <div className="text-lg font-bold text-primary">{site.farms.length}</div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Capacity Factor</span>
                        <TrendingUp className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-lg font-bold text-foreground">{site.avgCapacityFactor.toFixed(1)}%</div>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Availability</span>
                        <Zap className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-lg font-bold text-foreground">{site.avgAvailability.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Operating since {new Date(site.operatingDate).getFullYear()}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredSites.length === 0 && (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">No sites found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </Card>
        )}

        {/* Portfolio Summary */}
        <Card className="mt-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-6">Portfolio Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Sites</div>
              <div className="text-3xl font-bold text-primary">{siteMetrics.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Capacity</div>
              <div className="text-3xl font-bold text-primary">{siteMetrics.reduce((s, site) => s + site.totalCapacity, 0)} MW</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Turbines</div>
              <div className="text-3xl font-bold text-primary">{siteMetrics.reduce((s, site) => s + site.totalTurbines, 0)}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Avg Capacity Factor</div>
              <div className="text-3xl font-bold text-primary">{(siteMetrics.reduce((s, site) => s + site.avgCapacityFactor, 0) / siteMetrics.length).toFixed(1)}%</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
