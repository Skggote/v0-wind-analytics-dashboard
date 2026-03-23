# Real-Time Data Integration - Developer Implementation Guide

**Version:** 1.0  
**Target Audience:** Backend & Full-Stack Developers  
**Prerequisites:** Node.js 18+, TypeScript, Next.js 16+

---

## Quick Start: Converting from Mock to Real-Time Data

### Step 1: Create API Client Module

Create `lib/api-client.ts`:

```typescript
import { SCADAData, KPIs, Farm, Site, Turbine } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
  error?: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(endpoint, API_BASE_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }
    return result.data;
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(new URL(endpoint, API_BASE_URL), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }
    return result.data;
  }
}

export const apiClient = new ApiClient();
```

### Step 2: Create Real-Time Data Hook

Create `hooks/useRealtimeScada.ts`:

```typescript
import { useEffect, useRef, useState, useCallback } from 'react';
import { SCADAData } from '@/lib/mockData';

interface UseRealtimeScadaOptions {
  turbineId: string;
  enabled?: boolean;
  onError?: (error: Error) => void;
}

export function useRealtimeScada({
  turbineId,
  enabled = true,
  onError,
}: UseRealtimeScadaOptions) {
  const [data, setData] = useState<SCADAData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (!enabled) return;

    try {
      const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL}/ws/realtime`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('[WebSocket] Connected');
        setConnected(true);
        // Subscribe to turbine SCADA updates
        wsRef.current?.send(JSON.stringify({
          action: 'subscribe',
          channels: [`turbine:${turbineId}:scada`],
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'scada_update' && message.turbineId === turbineId) {
            setData(message);
            setLoading(false);
          }
        } catch (err) {
          console.error('[WebSocket] Message parse error:', err);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error('[WebSocket] Error:', event);
        const error = new Error('WebSocket connection error');
        onError?.(error);
      };

      wsRef.current.onclose = () => {
        console.log('[WebSocket] Disconnected');
        setConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
    }
  }, [turbineId, enabled, onError]);

  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [enabled, connect]);

  return { data, loading, connected };
}
```

### Step 3: Create Polling Hook for Fallback

Create `hooks/usePollingData.ts`:

```typescript
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface UsePollingDataOptions<T> {
  endpoint: string;
  params?: Record<string, any>;
  interval?: number; // ms
  enabled?: boolean;
}

export function usePollingData<T>({
  endpoint,
  params,
  interval = 5000, // 5 seconds by default
  enabled = true,
}: UsePollingDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const result = await apiClient.get<T>(endpoint, params);
        if (isMounted) {
          setData(result);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    };

    const poll = () => {
      fetchData();
      timeoutId = setTimeout(poll, interval);
    };

    poll();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [endpoint, params, interval, enabled]);

  return { data, loading, error };
}
```

### Step 4: Update Component - From Mock to Real-Time

**Before (Mock Data):**
```typescript
'use client';
import { useState, useEffect } from 'react';
import { generateSites } from '@/lib/mockData';

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  
  useEffect(() => {
    setSites(generateSites());
  }, []);

  return <div>{/* render sites */}</div>;
}
```

**After (Real-Time Data):**
```typescript
'use client';
import { usePollingData } from '@/hooks/usePollingData';
import { apiClient } from '@/lib/api-client';
import { Site } from '@/lib/mockData';

export default function SitesPage() {
  const { data: sites, loading, error } = usePollingData<Site[]>({
    endpoint: '/api/sites',
    interval: 30000, // Poll every 30 seconds for static data
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!sites) return <NoData />;

  return <div>{/* render sites */}</div>;
}
```

### Step 5: Update Analytics Charts for Real-Time

**Before (Mock):**
```typescript
const [energyData] = useState([
  { date: '24-05-2025', budgeted: 150, actual: 120 },
  // ... hardcoded data
]);
```

**After (Real-Time):**
```typescript
import { usePollingData } from '@/hooks/usePollingData';

interface EnergyMetrics {
  date: string;
  budgeted: number;
  actual: number;
}

export default function AnalyticsPage() {
  const { data: energyData, loading } = usePollingData<EnergyMetrics[]>({
    endpoint: '/api/analytics/energy-generation',
    params: {
      siteId: 'site-001',
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date().toISOString(),
      interval: '1d',
    },
    interval: 3600000, // Poll daily for historical data
  });

  if (loading) return <Spinner />;
  if (!energyData) return <NoData />;

  return (
    <LineChart data={energyData}>
      {/* chart configuration */}
    </LineChart>
  );
}
```

### Step 6: Create Context for Global Real-Time Data

Create `context/RealtimeContext.tsx`:

```typescript
'use client';
import { createContext, useContext, useCallback, useState } from 'react';
import { useRealtimeScada } from '@/hooks/useRealtimeScada';

interface RealtimeContextType {
  subscribeToTurbine: (turbineId: string) => void;
  unsubscribeFromTurbine: (turbineId: string) => void;
  getTurbineData: (turbineId: string) => any;
  isConnected: boolean;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [subscriptions, setSubscriptions] = useState<Set<string>>(new Set());
  const [turbineDataMap, setTurbineDataMap] = useState<Record<string, any>>({});

  const subscribeToTurbine = useCallback((turbineId: string) => {
    setSubscriptions(prev => new Set(prev).add(turbineId));
  }, []);

  const unsubscribeFromTurbine = useCallback((turbineId: string) => {
    setSubscriptions(prev => {
      const newSet = new Set(prev);
      newSet.delete(turbineId);
      return newSet;
    });
  }, []);

  const getTurbineData = useCallback((turbineId: string) => {
    return turbineDataMap[turbineId] || null;
  }, [turbineDataMap]);

  // Use real-time hook for each subscribed turbine
  Array.from(subscriptions).forEach(turbineId => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useRealtimeScada({ turbineId });
    if (data) {
      setTurbineDataMap(prev => ({ ...prev, [turbineId]: data }));
    }
  });

  return (
    <RealtimeContext.Provider
      value={{
        subscribeToTurbine,
        unsubscribeFromTurbine,
        getTurbineData,
        isConnected: true,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
}
```

---

## Environment Variables Setup

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Local Development
NODE_ENV=development

# For Production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
```

---

## Backend API Implementation (Node.js/Express Reference)

### Express Setup with Real-Time Data

```typescript
import express from 'express';
import { WebSocketServer } from 'ws';
import { Server } from 'http';
import InfluxDB from '@influxdata/influxdb-client';

const app = express();
const server = new Server(app);
const wss = new WebSocketServer({ server });

// InfluxDB client for time-series data
const influxDB = new InfluxDB({
  url: process.env.INFLUXDB_URL,
  token: process.env.INFLUXDB_TOKEN,
});

const queryApi = influxDB.getQueryApi(process.env.INFLUXDB_ORG);
const writeApi = influxDB.getWriteApi(
  process.env.INFLUXDB_ORG,
  process.env.INFLUXDB_BUCKET
);

// REST Endpoints
app.get('/api/sites', async (req, res) => {
  try {
    const fluxQuery = `
      from(bucket: "${process.env.INFLUXDB_BUCKET}")
        |> range(start: -30d)
        |> filter(fn: (r) => r._measurement == "site_metadata")
        |> last()
        |> group(columns: ["site_id"])
    `;
    
    const data = await queryApi.collectRows(fluxQuery);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/turbines/:turbineId/scada', async (req, res) => {
  try {
    const { turbineId } = req.params;
    const fluxQuery = `
      from(bucket: "${process.env.INFLUXDB_BUCKET}")
        |> range(start: -5m)
        |> filter(fn: (r) => r._measurement == "scada_readings")
        |> filter(fn: (r) => r.turbine_id == "${turbineId}")
        |> last()
    `;
    
    const data = await queryApi.collectRows(fluxQuery);
    res.json({ success: true, data: data[0] || null });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// WebSocket Real-Time Updates
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString());
      
      if (msg.action === 'subscribe') {
        // Subscribe to channels: ["turbine:turbine-001:scada"]
        ws.channels = msg.channels || [];
        console.log(`Client subscribed to: ${ws.channels.join(', ')}`);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// SCADA Data Ingestion (from IoT devices)
app.post('/api/ingest/scada', (req, res) => {
  try {
    const { turbineId, data } = req.body;
    
    // Write to InfluxDB
    const point = {
      measurement: 'scada_readings',
      tags: { turbine_id: turbineId },
      fields: {
        wind_speed: parseFloat(data.windSpeed),
        power_output: parseFloat(data.powerOutput),
        rotor_rpm: parseFloat(data.rotorRPM),
        // ... other fields
      },
      timestamp: new Date().getTime() * 1e6, // nanoseconds
    };
    
    writeApi.writePoint(point);
    
    // Broadcast to WebSocket subscribers
    wss.clients.forEach((client) => {
      if (client.channels?.includes(`turbine:${turbineId}:scada`)) {
        client.send(JSON.stringify({
          type: 'scada_update',
          turbineId,
          ...data,
          timestamp: new Date().toISOString(),
        }));
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

---

## Testing Real-Time Integration

### Unit Test Example

```typescript
import { useRealtimeScada } from '@/hooks/useRealtimeScada';
import { renderHook, waitFor } from '@testing-library/react';

describe('useRealtimeScada', () => {
  it('should connect to WebSocket and receive SCADA data', async () => {
    const { result } = renderHook(() =>
      useRealtimeScada({
        turbineId: 'turbine-001',
        enabled: true,
      })
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.connected).toBe(false);

    // Wait for connection
    await waitFor(() => {
      expect(result.current.connected).toBe(true);
    }, { timeout: 5000 });

    // Wait for data
    await waitFor(() => {
      expect(result.current.data).not.toBeNull();
      expect(result.current.loading).toBe(false);
    }, { timeout: 10000 });

    expect(result.current.data?.turbineId).toBe('turbine-001');
    expect(result.current.data?.windSpeed).toBeGreaterThan(0);
  });
});
```

### Integration Test with Mock API

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('http://localhost:3001/api/sites', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        data: [
          {
            id: 'site-001',
            name: 'Test Site',
            location: 'Test Location',
            totalCapacity: 100,
          },
        ],
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should fetch sites from API', async () => {
  const sites = await apiClient.get('/api/sites');
  expect(sites).toHaveLength(1);
  expect(sites[0].name).toBe('Test Site');
});
```

---

## Troubleshooting Common Issues

### Issue 1: WebSocket Connection Fails
**Symptom:** WebSocket connection hangs or fails with CORS error

**Solution:**
```typescript
// Check CORS configuration on backend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

// For WebSocket, ensure proper headers
wss = new WebSocketServer({
  server,
  perMessageDeflate: true,
});
```

### Issue 2: Stale Data in Charts
**Symptom:** Charts show old data after component mount

**Solution:**
```typescript
// Add proper cache busting
const { data, mutate } = usePollingData({
  endpoint: '/api/analytics/data',
  // Force refresh on mount
  key: `data-${Date.now()}`,
  revalidateOnFocus: true,
});

// Or manually refresh
const handleRefresh = () => mutate();
```

### Issue 3: Memory Leaks with WebSocket
**Symptom:** Multiple WebSocket connections open, increasing memory

**Solution:**
```typescript
useEffect(() => {
  // Proper cleanup
  return () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'unsubscribe',
        channels,
      }));
      wsRef.current.close();
    }
  };
}, []);
```

---

## Performance Optimization Tips

1. **Memoize expensive computations:**
```typescript
const memoizedMetrics = useMemo(() => {
  return calculateKPIs(scadaData);
}, [scadaData]);
```

2. **Lazy load chart components:**
```typescript
const TurbineChart = dynamic(() => import('@/components/TurbineChart'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

3. **Implement virtual scrolling for large lists:**
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={turbines.length}
  itemSize={35}
>
  {TurbineRow}
</FixedSizeList>
```

4. **Use SWR for automatic caching and revalidation:**
```typescript
import useSWR from 'swr';

const { data } = useSWR('/api/sites', apiClient.get, {
  revalidateOnFocus: false,
  dedupingInterval: 60000, // 1 minute
});
```

---

This guide provides a complete pathway for converting the Wind Analytics Dashboard from mock data to real-time operational data. Start with Step 1 and progress sequentially for a smooth integration.
