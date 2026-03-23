'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateFarms, generateTurbines } from '@/lib/mockData';
import { Download, Calendar, Filter } from 'lucide-react';

export default function DataExportPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('mis-data');
  const [dateRange, setDateRange] = useState('30');
  const [selectedSite, setSelectedSite] = useState('all');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const farms = generateFarms();
  const generateMISData = () => {
    return [
      { date: '24-05-2025', site: 'A', acCap: 29.4, rundlyEnergy: 266.84, actEnergy: 48.00, budgRev: 0.87, actRev: 0.81, tpltPlf: 48.54, actPlf: 7.07, totWS: 7.25, actWS: 6.29, commPA: 59.24, techPA: 7.08, variance: -0.020 },
      { date: '25-05-2025', site: 'A', acCap: 29.4, rundlyEnergy: 228.37, actEnergy: 185.38, budgRev: 0.85, actRev: 0.93, tpltPlf: 34.79, actPlf: 36.02, totWS: 6.48, actWS: 6.48, commPA: 89.92, techPA: 38.88, variance: -0.010 },
      { date: '26-05-2025', site: 'A', acCap: 29.4, rundlyEnergy: 331.36, actEnergy: 139.80, budgRev: 0.18, actRev: 0.94, tpltPlf: 52.30, actPlf: 28.03, totWS: 8.59, actWS: 6.58, commPA: 90.78, techPA: 36.73, variance: -0.010 },
      { date: '27-05-2025', site: 'A', acCap: 29.4, rundlyEnergy: 480.25, actEnergy: 317.18, budgRev: 0.12, actRev: 0.99, tpltPlf: 64.59, actPlf: 58.95, totWS: 18.96, actWS: 7.79, commPA: 90.32, techPA: 56.78, variance: -0.010 },
      { date: '28-05-2025', site: 'B', acCap: 29.4, rundlyEnergy: 418.43, actEnergy: 299.29, budgRev: 0.12, actRev: 0.90, tpltPlf: 64.78, actPlf: 34.75, totWS: 9.79, actWS: 6.58, commPA: 94.39, techPA: 63.61, variance: -0.040 },
      { date: '29-05-2025', site: 'B', acCap: 29.4, rundlyEnergy: 364.81, actEnergy: 213.99, budgRev: 0.11, actRev: 0.80, tpltPlf: 57.58, actPlf: 33.75, totWS: 8.72, actWS: 6.30, commPA: 90.23, techPA: 78.18, variance: -0.020 },
      { date: '30-05-2025', site: 'B', acCap: 29.4, rundlyEnergy: 344.91, actEnergy: 298.79, budgRev: 0.18, actRev: 0.15, tpltPlf: 54.44, actPlf: 70.89, totWS: 8.71, actWS: 9.58, commPA: 90.03, techPA: 96.19, variance: '+0.050 },
      { date: '31-05-2025', site: 'B', acCap: 29.4, rundlyEnergy: 347.88, actEnergy: 547.20, budgRev: 0.18, actRev: 0.36, tpltPlf: 54.91, actPlf: 95.36, totWS: 8.69, actWS: 9.19, commPA: 90.51, techPA: 93.41, variance: '+0.050 },
      { date: '01-05-2025', site: 'C', acCap: 33, rundlyEnergy: 425.54, actEnergy: 596.78, budgRev: 0.12, actRev: 0.17, tpltPlf: 53.73, actPlf: 75.34, totWS: 8.43, actWS: 8.80, commPA: 100.89, techPA: 100.88, variance: '+0.050 },
    ];
  };

  const generateTurbineData = () => {
    return [
      { turbine: 'WTG-A#1', site: 'A', cap: 2.1, gen: 85.2, budgGen: 152.1, genVar: '-44.06', cuf: 22.4, budgCuf: 39.9, cufVar: '-43.25', plf: 78.5, avail: 82.3, budgAvail: 95, availVar: '-13.3', maint: 'Scheduled' },
      { turbine: 'WTG-A#2', site: 'A', cap: 2.1, gen: 92.8, budgGen: 152.1, genVar: '-39.0', cuf: 16.5, budgCuf: 39.9, cufVar: '-58.6', plf: 65.2, avail: 88.3, budgAvail: 95, availVar: '-7.0', maint: 'Preventive' },
      { turbine: 'WTG-A#3', site: 'A', cap: 2.1, gen: 95.4, budgGen: 152.1, genVar: '-37.3', cuf: 25.1, budgCuf: 39.9, cufVar: '-37.1', plf: 82.3, avail: 85.8, budgAvail: 95, availVar: '-9.6', maint: 'Corrective' },
      { turbine: 'WTG-A#4', site: 'A', cap: 2.1, gen: 138.6, budgGen: 152.1, genVar: '-8.9', cuf: 36.4, budgCuf: 39.9, cufVar: '-0.8', plf: 91.1, avail: 97.8, budgAvail: 95, availVar: '+2.8', maint: 'Preventive' },
      { turbine: 'WTG-B#1', site: 'B', cap: 2.1, gen: 108.3, budgGen: 183.5, genVar: '+2.2', cuf: 52.1, budgCuf: 48.2, cufVar: '+8.1', plf: 88.8, avail: 89.2, budgAvail: 95, availVar: '-6.1', maint: 'Preventive' },
      { turbine: 'WTG-B#2', site: 'B', cap: 2.1, gen: 145.7, budgGen: 183.5, genVar: '-20.6', cuf: 38.3, budgCuf: 48.2, cufVar: '-20.5', plf: 77.8, avail: 92.8, budgAvail: 95, availVar: '-2.3', maint: 'Preventive' },
      { turbine: 'WTG-B#3', site: 'B', cap: 2.1, gen: 285.4, budgGen: 183.5, genVar: '+55.5', cuf: 75, budgCuf: 48.2, cufVar: '+55.6', plf: 99.2, avail: 98.5, budgAvail: 95, availVar: '+3.5', maint: 'Preventive' },
      { turbine: 'WTG-B#4', site: 'B', cap: 2.1, gen: 262.6, budgGen: 183.5, genVar: '+37.7', cuf: 90.4, budgCuf: 48.2, cufVar: '+37.8', plf: 93.1, avail: 99.1, budgAvail: 95, availVar: '+4.1', maint: 'Preventive' },
      { turbine: 'WTG-C#1', site: 'C', cap: 3.3, gen: 285.3, budgGen: 212.5, genVar: '+34.1', cuf: 68.1, budgCuf: 44.8, cufVar: '+34.2', plf: 89.4, avail: 92.8, budgAvail: 95, availVar: '-2.3', maint: 'Corrective' },
      { turbine: 'WTG-C#2', site: 'C', cap: 3.3, gen: 311.4, budgGen: 212.5, genVar: '+46.3', cuf: 80.6, budgCuf: 44.8, cufVar: '+46.5', plf: 94.8, avail: 100, budgAvail: 95, availVar: '+5.0', maint: 'Preventive' },
    ];
  };

  const generateBreakdownData = () => {
    return [
      { turbine: 'WTG-A#1', site: 'A', faultType: 'Gearbox Overheating', description: 'High temperature alarm on gearbox oil...', start: '24-05-2025 02:15', end: '24-05-2025 14:30', duration: 12.25, loss: -45.200, status: 'Resolved' },
      { turbine: 'WTG-A#3', site: 'A', faultType: 'Yaw System Fault', description: 'Yaw motor controller malfunction caus...', start: '25-05-2025 09:00', end: '25-05-2025 18:45', duration: 9.75, loss: -38.500, status: 'Resolved' },
      { turbine: 'WTG-A#2', site: 'A', faultType: 'Blade Pitch Error', description: 'Pitch angle servo stuck in intermediate...', start: '26-05-2025 06:20', end: '27-05-2025 03:45', duration: 21.42, loss: -92.680, status: 'Resolved' },
      { turbine: 'WTG-B#1', site: 'B', faultType: 'Generator Bearing Fault', description: 'Elevated vibration levels on generator D...', start: '28-05-2025 11:00', end: '29-05-2025 00:00', duration: 13, loss: -67.200, status: 'Resolved' },
      { turbine: 'WTG-B#2', site: 'B', faultType: 'Converter Fault', description: 'Power converter IGBT module failure', start: '28-05-2025 15:30', end: '28-05-2025 23:08', duration: 7.63, loss: -1, loss: -35.460, status: 'Resolved' },
      { turbine: 'WTG-B#3', site: 'B', faultType: 'Grid Connection Loss', description: 'Voltage dip causing grid relay trip', start: '30-05-2025 01:00', end: '30-05-2025 04:30', duration: 3.5, loss: -12.400, status: 'Resolved' },
      { turbine: 'WTG-C#1', site: 'C', faultType: 'Cooling System Failure', description: 'Coolant pump failure in generator', start: '30-05-2025 14:15', end: '31-05-2025 08:00', duration: 17.75, loss: -82.050, status: 'Resolved' },
      { turbine: 'WTG-A#1', site: 'A', faultType: 'Anemometer Malfunction', description: 'Wind speed sensor providing erratic mea...', start: '27-05-2025 14:00', end: '27-05-2025 18:30', duration: 4.5, loss: -15.200, status: 'Resolved' },
    ];
  };

  const generatePlantData = () => {
    return [
      { site: 'A', plantName: 'Wind Farm Alpha', capacity: 29.4, turbines: 14, location: 'Rajasthan, India', zonalHead: 'Sandeep Singh Khochi', commissioning: 'Mar 2022', turbineModel: 'Siemens S126 - 2.1 MW' },
      { site: 'B', plantName: 'Wind Farm Beta', capacity: 29.4, turbines: 14, location: 'Gujarat, India', zonalHead: 'Sandeep Singh Khochi', commissioning: 'Jul 2022', turbineModel: 'Siemens S126 - 2.1 MW' },
      { site: 'C', plantName: 'Wind Farm Gamma', capacity: 33, turbines: 10, location: 'Tamil Nadu, India', zonalHead: 'Sandeep Singh Khochi', commissioning: 'Nov 2023', turbineModel: 'Vestas V158 - 3.3 MW' },
    ];
  };

  const generateRevenueLossData = () => {
    return [
      { date: '24-05-2025', site: 'A', budgRev: 0.87, actRev: 0.81, variance: '-0.020', wsCorr: 0.831524, windLoss: '-0.81', wsCorrGain: '1,74,390.37', ratio: '-47.28%', revTat: '0.805885' },
      { date: '25-05-2025', site: 'A', budgRev: 0.86, actRev: 0.93, variance: '-0.010', wsCorr: 0.836993, windLoss: '0.00', wsCorrGain: '69,559.96', ratio: '-28.37%', revTat: '0.805937' },
      { date: '26-05-2025', site: 'A', budgRev: 0.18, actRev: 0.94, variance: '+0.050', wsCorr: 0.836318, windLoss: '0.00', wsCorrGain: '30,695.47', ratio: '4.13%', revTat: '0.805381' },
      { date: '27-05-2025', site: 'A', budgRev: 0.12, actRev: 0.99, variance: '-0.010', wsCorr: 0.870671, windLoss: '-0.62', wsCorrGain: '1,32,363.64', ratio: '12.93%', revTat: '0.819217' },
      { date: '28-05-2025', site: 'B', budgRev: 0.12, actRev: 0.90, variance: '-0.040', wsCorr: 0.909959, windLoss: '-0.93', wsCorrGain: '-52,987.54', ratio: '-5.64%', revTat: '0.819524' },
      { date: '29-05-2025', site: 'B', budgRev: 0.11, actRev: 0.80, variance: '-0.030', wsCorr: 0.902089, windLoss: '-0.93', wsCorrGain: '+1,775.54', ratio: '-4.50%', revTat: '0.815689' },
      { date: '30-05-2025', site: 'B', budgRev: 0.18, actRev: 0.15, variance: '+0.008', wsCorr: 0.905999, windLoss: '0.00', wsCorrGain: '4,85,936.32', ratio: '68.97%', revTat: '0.811306' },
      { date: '31-05-2025', site: 'B', budgRev: 0.18, actRev: 0.16, variance: '-0.006', wsCorr: 0.184543, windLoss: '0.00', wsCorrGain: '5,49,446.33', ratio: '54.13%', revTat: '0.811499' },
      { date: '01-06-2025', site: 'C', budgRev: 0.12, actRev: 0.17, variance: '+0.200', wsCorr: 0.128874, windLoss: '0.01', wsCorrGain: '4,41,658.31', ratio: '36.72%', revTat: '0.814645' },
    ];
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      `${filename}`,
      `Exported on: ${new Date().toLocaleString()}`,
      `Date Range: ${dateRange} days | Site: ${selectedSite}`,
      '',
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const DataTable = ({ data, columns }: any) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col: string) => (
              <th key={col} className="text-left p-3 font-semibold text-muted-foreground bg-card">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, idx: number) => (
            <tr key={idx} className="border-b border-border hover:bg-accent/20 transition">
              {columns.map((col: string) => {
                const value = row[col.toLowerCase().replace(/\s+/g, '')];
                const isVariance = col.toLowerCase().includes('var');
                const isNegative = typeof value === 'number' && value < 0;
                
                return (
                  <td key={`${idx}-${col}`} className={`p-3 ${isVariance && isNegative ? 'text-red-400' : isVariance ? 'text-green-400' : 'text-foreground'}`}>
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Download Center</h1>
          <p className="text-muted-foreground">Exportable tables for MIS data, revenue losses, breakdown incidents, plant details, and turbine generation</p>
        </div>

        {/* Filters */}
        <Card className="bg-card border border-border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Period</label>
              <input
                type="date"
                value={`2025-05-${dateRange === '30' ? '24' : '01'}`}
                onChange={(e) => setDateRange('30')}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">To Date</label>
              <input
                type="date"
                value="2025-06-01"
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Site</label>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full bg-background border border-border rounded px-3 py-2 text-foreground text-sm"
              >
                <option value="all">All Sites</option>
                <option value="A">Site A</option>
                <option value="B">Site B</option>
                <option value="C">Site C</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-card border border-border p-1">
            <TabsTrigger value="mis-data">MIS Data</TabsTrigger>
            <TabsTrigger value="revenue-losses">Revenue Losses</TabsTrigger>
            <TabsTrigger value="breakdowns">Breakdowns</TabsTrigger>
            <TabsTrigger value="plant-details">Plant Details</TabsTrigger>
            <TabsTrigger value="turbine-gen">Turbine Generation</TabsTrigger>
          </TabsList>

          {/* MIS Data Tab */}
          <TabsContent value="mis-data" className="space-y-4">
            <Card className="bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">MIS Data Summary</h3>
                  <p className="text-sm text-muted-foreground">Daily generation, revenue, PLF, wind speed, and availability metrics</p>
                </div>
                <Button
                  onClick={() => exportToCSV(generateMISData(), 'MIS-Data-Summary')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
              <DataTable
                data={generateMISData()}
                columns={['Date', 'Site', 'AC Cap.', 'Rundly Energy', 'Act Energy', 'Budg. Rev.', 'Act. Rev.', 'TPLT PLF', 'ACT PLF', 'TOT W/S', 'ACT W/S', 'Comm. PA', 'Tech. PA', 'Variance']}
              />
            </Card>
          </TabsContent>

          {/* Revenue Losses Tab */}
          <TabsContent value="revenue-losses" className="space-y-4">
            <Card className="bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Revenue Loss Summary</h3>
                  <p className="text-sm text-muted-foreground">Detailed view of revenue variances, wind losses, and corrected gain/loss values</p>
                </div>
                <Button
                  onClick={() => exportToCSV(generateRevenueLossData(), 'Revenue-Loss-Summary')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
              <DataTable
                data={generateRevenueLossData()}
                columns={['Date', 'Site', 'Budg. Rev. (C€)', 'Act. Rev. (C€)', 'Variance', 'W/S Corr. Budget', 'Wind Loss', 'W/S Corr. Gain/Loss', 'Ratio %', 'Rev./TAT W/S']}
              />
            </Card>
          </TabsContent>

          {/* Breakdowns Tab */}
          <TabsContent value="breakdowns" className="space-y-4">
            <Card className="bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Breakdown Incidents</h3>
                  <p className="text-sm text-muted-foreground">All fault events with turbine identification, duration, and financial impact</p>
                </div>
                <Button
                  onClick={() => exportToCSV(generateBreakdownData(), 'Breakdown-Incidents')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
              <DataTable
                data={generateBreakdownData()}
                columns={['Turbine', 'Site', 'Fault Type', 'Description', 'Start', 'End', 'Duration (h)', 'Loss (€/k)', 'Status']}
              />
            </Card>
          </TabsContent>

          {/* Plant Details Tab */}
          <TabsContent value="plant-details" className="space-y-4">
            <Card className="bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Static Plant Details</h3>
                  <p className="text-sm text-muted-foreground">Plant configuration, turbine models, capacity, and commissioning information</p>
                </div>
                <Button
                  onClick={() => exportToCSV(generatePlantData(), 'Plant-Details')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
              <DataTable
                data={generatePlantData()}
                columns={['Site', 'Plant Name', 'Capacity (MW)', 'Turbines', 'Location', 'Zonal Head', 'Commissioning', 'Turbine Model']}
              />
            </Card>
          </TabsContent>

          {/* Turbine Generation Tab */}
          <TabsContent value="turbine-gen" className="space-y-4">
            <Card className="bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Turbine-wise Generation Metrics</h3>
                  <p className="text-sm text-muted-foreground">Active power, CUF, PLF, availability with budget figures and variation percentages</p>
                </div>
                <Button
                  onClick={() => exportToCSV(generateTurbineData(), 'Turbine-Generation-Metrics')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
              <DataTable
                data={generateTurbineData()}
                columns={['Turbine', 'Site', 'Cap. (MW)', 'Gen. (MWh)', 'Budg Gen', 'Gen Var %', 'CUF %', 'Budg CUF', 'CUF Var %', 'PLF %', 'Avail %', 'Budg Avail', 'Avail Var %', 'Maint L.']}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
