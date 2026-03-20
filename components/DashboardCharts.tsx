'use client';

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Card } from '@/components/ui/card';

interface TimeSeriesData {
  time: string;
  avgWindSpeed: number;
  avgPower: number;
  avgTemp: number;
  maxVibration: number;
}

// Power Generation Chart
export function PowerGenerationChart({ data }: { data: TimeSeriesData[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">Power Generation & Wind Speed</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis yAxisId="left" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            labelStyle={{ color: 'var(--foreground)' }}
          />
          <Legend />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="avgPower"
            fill="var(--chart-1)"
            stroke="var(--chart-1)"
            fillOpacity={0.3}
            name="Power (kW)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgWindSpeed"
            stroke="var(--chart-2)"
            name="Wind Speed (m/s)"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Temperature Monitoring Chart
export function TemperatureChart({ data }: { data: TimeSeriesData[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">Temperature Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            labelStyle={{ color: 'var(--foreground)' }}
            formatter={(value) => `${(value as number).toFixed(1)}°C`}
          />
          <Area
            type="monotone"
            dataKey="avgTemp"
            stroke="var(--chart-3)"
            fillOpacity={1}
            fill="url(#colorTemp)"
            name="Temperature (°C)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Vibration Analysis Chart
export function VibrationChart({ data }: { data: TimeSeriesData[] }) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">Vibration Analysis</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            labelStyle={{ color: 'var(--foreground)' }}
            formatter={(value) => `${(value as number).toFixed(2)} mm/s`}
          />
          <Bar dataKey="maxVibration" fill="var(--chart-4)" name="Max Vibration (mm/s)">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.maxVibration > 0.8 ? 'var(--destructive)' : 'var(--chart-4)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Efficiency Distribution Chart
export function EfficiencyChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'];

  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">Fleet Efficiency Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            labelStyle={{ color: 'var(--foreground)' }}
            formatter={(value) => `${(value as number).toFixed(1)}%`}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Forecast Chart
export function ForecastChart({
  data,
}: {
  data: Array<{ date: string; forecastedPower: number; confidence: number }>;
}) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">7-Day Power Forecast</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis yAxisId="left" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            labelStyle={{ color: 'var(--foreground)' }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="forecastedPower"
            fill="var(--chart-1)"
            name="Forecasted Power (kW)"
            opacity={0.7}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="confidence"
            stroke="var(--chart-5)"
            name="Confidence (%)"
            strokeWidth={2}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}

// Turbine Scatter Chart (Performance vs Health)
export function TurbinePerformanceScatter({
  data,
}: {
  data: Array<{ name: string; efficiency: number; health: number; size: number }>;
}) {
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold mb-4">Turbine Performance vs Health</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="efficiency" name="Efficiency (%)" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis dataKey="health" name="Health Score" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
            labelStyle={{ color: 'var(--foreground)' }}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter name="Turbines" data={data} fill="var(--chart-1)" />
        </ScatterChart>
      </ResponsiveContainer>
    </Card>
  );
}
