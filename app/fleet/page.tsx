'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/KPICard';
import { generateFarms, generateTurbines } from '@/lib/mockData';
import { useMemo, useState, useEffect } from 'react';
import { AlertTriangle, Zap, MapPin } from 'lucide-react';

export default function FleetPage() {
  const [isClient, setIsClient] = useState(false);
  const farms = useMemo(() => generateFarms(), []);
  const [selectedFarm, setSelectedFarm] = useState<string>('farm-001');

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const turbines = useMemo(() => {
    const farm = farms.find(f => f.id === selectedFarm);
    return farm ? generateTurbines(farm.id, farm.turbineCount) : [];
  }, [selectedFarm, farms]);

  const currentFarm = farms.find(f => f.id === selectedFarm);

  const statusCounts = useMemo(() => {
    return {
      operational: turbines.filter(t => t.status === 'operational').length,
      maintenance: turbines.filter(t => t.status === 'maintenance').length,
      offline: turbines.filter(t => t.status === 'offline').length,
      error: turbines.filter(t => t.status === 'error').length,
    };
  }, [turbines]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'maintenance':
        return 'In Maintenance';
      case 'offline':
        return 'Offline';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all turbines across your wind farms
          </p>
        </div>

        {/* Farm Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {farms.map(farm => (
            <Card
              key={farm.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedFarm === farm.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedFarm(farm.id)}
            >
              <h3 className="font-semibold text-sm">{farm.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{farm.location}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {farm.turbineCount} turbines • {farm.totalCapacity} MW
              </p>
              <div className={`inline-block mt-3 px-2 py-1 rounded text-xs font-medium ${
                farm.status === 'operational'
                  ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                  : farm.status === 'degraded'
                    ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300'
              }`}>
                {farm.status}
              </div>
            </Card>
          ))}
        </div>

        {/* Farm Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Operational"
            value={statusCounts.operational}
            unit="turbines"
            status="normal"
            icon={<Zap className="w-5 h-5" />}
          />
          <KPICard
            title="Maintenance"
            value={statusCounts.maintenance}
            unit="turbines"
            status={statusCounts.maintenance > 2 ? 'warning' : 'normal'}
          />
          <KPICard
            title="Offline"
            value={statusCounts.offline}
            unit="turbines"
            status={statusCounts.offline > 0 ? 'critical' : 'normal'}
          />
          <KPICard
            title="Error"
            value={statusCounts.error}
            unit="turbines"
            status={statusCounts.error > 0 ? 'critical' : 'normal'}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="map">Spatial View</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Map View */}
          <TabsContent value="map">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">{currentFarm?.name} - Turbine Locations</h3>
              
              {/* Simulated Grid Layout */}
              <div className="bg-muted p-6 rounded-lg border border-border">
                <div className="grid grid-cols-8 gap-3 md:gap-4">
                  {turbines.map(turbine => (
                    <div
                      key={turbine.id}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${getStatusColor(
                          turbine.status
                        )} flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        {turbines.indexOf(turbine) + 1}
                      </div>
                      <p className="text-xs font-medium text-center line-clamp-1">
                        T{String(turbines.indexOf(turbine) + 1).padStart(2, '0')}
                      </p>
                      <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="whitespace-nowrap">{getStatusLabel(turbine.status)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="text-sm text-muted-foreground">Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-500" />
                  <span className="text-sm text-muted-foreground">Offline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Error</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details">
            <Card className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Capacity</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Maintenance</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Health</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {turbines.map((turbine, idx) => (
                      <tr key={turbine.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">T{String(idx + 1).padStart(2, '0')}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              turbine.status === 'operational'
                                ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300'
                                : turbine.status === 'maintenance'
                                  ? 'bg-yellow-100 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300'
                                  : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                            }`}
                          >
                            {getStatusLabel(turbine.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{turbine.capacity} MW</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(turbine.lastMaintenanceDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          {(75 + Math.random() * 20).toFixed(1)}%
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {turbine.latitude.toFixed(2)}°, {turbine.longitude.toFixed(2)}°
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Recent Events</h3>
              <div className="space-y-4">
                {[
                  { time: '2 hours ago', event: 'Turbine 5 moved to maintenance', type: 'maintenance' },
                  { time: '5 hours ago', event: 'Anomaly detected on Turbine 12', type: 'alert' },
                  { time: '12 hours ago', event: 'Turbine 3 returned to operational', type: 'success' },
                  { time: '1 day ago', event: 'Scheduled maintenance completed for Turbine 8', type: 'success' },
                  { time: '2 days ago', event: 'Fleet reached 98.2% availability', type: 'success' },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-3 h-3 rounded-full mt-2 ${
                          item.type === 'success'
                            ? 'bg-green-500'
                            : item.type === 'alert'
                              ? 'bg-red-500'
                              : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.event}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
