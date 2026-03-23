'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateFarms, generateTurbines, generateSCADAData, calculateKPIs } from '@/lib/mockData';
import { Download, FileText, BarChart3, Calendar, Filter } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'performance' | 'maintenance' | 'financial'>('performance');
  const [dateRange, setDateRange] = useState('30');
  const [selectedFarm, setSelectedFarm] = useState('farm-001');

  const farms = generateFarms();
  const turbines = generateTurbines(selectedFarm, 45);

  // Generate report summary
  const reportSummary = (() => {
    let totalCapacityFactor = 0;
    let totalAvailability = 0;
    let totalRevenue = 0;
    let turbineCount = 0;

    turbines.slice(0, 10).forEach(turbine => {
      const scadaData = generateSCADAData(turbine.id, 24);
      const kpis = calculateKPIs(scadaData);
      totalCapacityFactor += kpis.capacity_factor;
      totalAvailability += kpis.availability;
      totalRevenue += kpis.revenue_per_turbine;
      turbineCount++;
    });

    return {
      avgCapacityFactor: totalCapacityFactor / turbineCount,
      avgAvailability: totalAvailability / turbineCount,
      totalRevenue: totalRevenue,
    };
  })();

  // Export handlers
  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    let content = '';
    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'csv') {
      // CSV export
      content = `Wind Farm ${reportType.toUpperCase()} Report
Date: ${new Date().toLocaleDateString()}
Farm: ${farms.find(f => f.id === selectedFarm)?.name}

Metric,Value,Unit
Avg Capacity Factor,${reportSummary.avgCapacityFactor.toFixed(2)},%
Avg Availability,${reportSummary.avgAvailability.toFixed(2)},%
Total Revenue,${reportSummary.totalRevenue.toFixed(2)},$

Detailed Metrics:
`;

      turbines.slice(0, 10).forEach(turbine => {
        const scadaData = generateSCADAData(turbine.id, 24);
        const kpis = calculateKPIs(scadaData);
        content += `${turbine.name},${kpis.capacity_factor.toFixed(2)},${kpis.availability.toFixed(2)},${kpis.health_score.toFixed(2)}\n`;
      });

      const blob = new Blob([content], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `windflow-report-${reportType}-${timestamp}.csv`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and export comprehensive performance reports</p>
        </div>

        {/* Report Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground"
            >
              <option value="performance">Performance Report</option>
              <option value="maintenance">Maintenance Report</option>
              <option value="financial">Financial Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Farm</label>
            <select
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground"
            >
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>{farm.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button className="w-full gap-2">
              <Filter className="w-4 h-4" />
              Apply Filters
            </Button>
          </div>
        </div>

        {/* Report Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Capacity Factor</p>
                <h3 className="text-3xl font-bold text-foreground">{reportSummary.avgCapacityFactor.toFixed(1)}%</h3>
              </div>
              <BarChart3 className="w-8 h-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Industry avg: 35-45%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Availability</p>
                <h3 className="text-3xl font-bold text-foreground">{reportSummary.avgAvailability.toFixed(1)}%</h3>
              </div>
              <BarChart3 className="w-8 h-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Target: 97-99%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-foreground">${(reportSummary.totalRevenue / 1000).toFixed(1)}K</h3>
              </div>
              <BarChart3 className="w-8 h-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">Last {dateRange} days</p>
          </Card>
        </div>

        {/* Export Options */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Download className="w-6 h-6 text-accent" />
            Export Report
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* CSV Export */}
            <div className="border border-border rounded-lg p-6 hover:bg-card/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">CSV Export</h3>
                  <p className="text-xs text-muted-foreground">Spreadsheet format</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Perfect for data analysis and manipulation</p>
              <Button onClick={() => handleExport('csv')} variant="outline" className="w-full">
                Download CSV
              </Button>
            </div>

            {/* PDF Export */}
            <div className="border border-border rounded-lg p-6 hover:bg-card/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-accent" />
                <div>
                  <h3 className="font-semibold text-foreground">PDF Export</h3>
                  <p className="text-xs text-muted-foreground">Professional report</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Formatted for presentation and printing</p>
              <Button onClick={() => handleExport('pdf')} variant="outline" className="w-full" disabled>
                Download PDF
              </Button>
            </div>

            {/* Excel Export */}
            <div className="border border-border rounded-lg p-6 hover:bg-card/50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Excel Export</h3>
                  <p className="text-xs text-muted-foreground">Advanced workbook</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">With charts, tables and formatting</p>
              <Button onClick={() => handleExport('excel')} variant="outline" className="w-full" disabled>
                Download Excel
              </Button>
            </div>
          </div>
        </Card>

        {/* Report Sections */}
        <div className="space-y-6">
          {reportType === 'performance' && (
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-foreground">Capacity Factor (Avg)</span>
                  <span className="font-bold text-primary">{reportSummary.avgCapacityFactor.toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-foreground">Availability (Avg)</span>
                  <span className="font-bold text-primary">{reportSummary.avgAvailability.toFixed(2)}%</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-foreground">Energy Generated</span>
                  <span className="font-bold text-primary">Loading...</span>
                </div>
              </div>
            </Card>
          )}

          {reportType === 'maintenance' && (
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Maintenance Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-foreground">Turbines Needing Service</span>
                  <span className="font-bold text-primary">{Math.floor(turbines.length * 0.1)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-foreground">Scheduled Maintenance</span>
                  <span className="font-bold text-primary">3 tasks</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-foreground">Avg Maintenance Cost</span>
                  <span className="font-bold text-primary">$2,450/turbine</span>
                </div>
              </div>
            </Card>
          )}

          {reportType === 'financial' && (
            <Card className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-foreground">Total Revenue</span>
                  <span className="font-bold text-primary">${reportSummary.totalRevenue.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-foreground">Operating Costs</span>
                  <span className="font-bold text-primary">${(reportSummary.totalRevenue * 0.15).toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-foreground">Net Profit</span>
                  <span className="font-bold text-primary text-green-400">${(reportSummary.totalRevenue * 0.85).toFixed(0)}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
