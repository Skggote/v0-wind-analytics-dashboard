'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Filter, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardFiltersProps {
  farms: Array<{ id: string; name: string }>;
  selectedFarm: string;
  onFarmChange: (farmId: string) => void;
  dateRange: 'today' | '7days' | '30days' | '90days' | 'custom';
  onDateRangeChange: (range: typeof dateRange) => void;
  aggregation: 'hour' | 'day' | 'week';
  onAggregationChange: (agg: typeof aggregation) => void;
  turbineFilter?: string;
  onTurbineFilterChange?: (filter: string) => void;
}

export function DashboardFilters({
  farms,
  selectedFarm,
  onFarmChange,
  dateRange,
  onDateRangeChange,
  aggregation,
  onAggregationChange,
  turbineFilter = 'all',
  onTurbineFilterChange,
}: DashboardFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <Card className="p-4 mb-6">
      <div className="space-y-4">
        {/* Primary Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Farm</label>
            <Select value={selectedFarm} onValueChange={onFarmChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select farm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Farms</SelectItem>
                {farms.map(farm => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Time Range</label>
            <Select value={dateRange} onValueChange={onDateRangeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Aggregation</label>
            <Select value={aggregation} onValueChange={onAggregationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select aggregation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Hourly</SelectItem>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="border-t pt-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 space-y-3 pt-3 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Turbine Status</label>
                  <Select value={turbineFilter} onValueChange={onTurbineFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Turbines</SelectItem>
                      <SelectItem value="operational">Operational</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="anomalies">With Anomalies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Health Status</label>
                  <Select defaultValue="all" onValueChange={() => {}}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select health" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="healthy">Healthy (&gt; 80%)</SelectItem>
                      <SelectItem value="degraded">Degraded (60-80%)</SelectItem>
                      <SelectItem value="critical">Critical (&lt; 60%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {selectedFarm !== 'all' || dateRange !== '7days' || turbineFilter !== 'all' ? (
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {selectedFarm !== 'all' && (
              <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded flex items-center gap-1">
                <span>Farm: {farms.find(f => f.id === selectedFarm)?.name}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-primary/70" onClick={() => onFarmChange('all')} />
              </div>
            )}
            {turbineFilter !== 'all' && (
              <div className="bg-primary/10 text-primary text-xs px-2 py-1 rounded flex items-center gap-1">
                <span>Status: {turbineFilter}</span>
                <X className="w-3 h-3 cursor-pointer hover:text-primary/70" onClick={() => onTurbineFilterChange?.('all')} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
