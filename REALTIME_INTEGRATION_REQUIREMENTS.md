# Real-Time Data Integration Requirements
## Wind Generation Portal - Real-Time Analytics Dashboard

**Document Version:** 1.0  
**Last Updated:** March 23, 2026  
**Status:** Ready for Implementation

---

## Executive Summary

The Wind Generation Portal currently operates with mock/dummy data for demonstration purposes. This document outlines the complete requirements for integrating real-time SCADA (Supervisory Control and Data Acquisition) data from wind farms to power the analytics dashboard with live operational data.

---

## 1. Current Data Architecture

### 1.1 Mock Data Structure

The application uses TypeScript interfaces defined in `lib/mockData.ts`:

```typescript
// Key Interfaces Currently Mocked

// Site Level
interface Site {
  id: string;
  name: string;
  location: string;
  country: string;
  farms: string[];                  // Array of farm IDs
  totalCapacity: number;             // MW
  totalTurbines: number;
  operatingDate: string;             // ISO 8601
  owner: string;
  latitude: number;
  longitude: number;
}

// Farm Level
interface Farm {
  id: string;
  name: string;
  location: string;
  turbineCount: number;
  totalCapacity: number;             // MW
  status: 'operational' | 'degraded' | 'offline';
  latitude: number;
  longitude: number;
  operatingDate: string;
  designCapacity: number;            // MW
  powerCurve: number;                // MW rating
}

// Turbine Level
interface Turbine {
  id: string;
  name: string;
  farmId: string;
  latitude: number;
  longitude: number;
  capacity: number;                  // MW
  status: 'operational' | 'maintenance' | 'offline' | 'error';
  lastMaintenanceDate: string;
}

// Real-Time SCADA Data (generated every 5 seconds in mock)
interface SCADAData {
  timestamp: string;                 // ISO 8601
  turbineId: string;
  windSpeed: number;                 // m/s
  windDirection: number;             // degrees (0-360)
  temperature: number;               // Celsius
  powerOutput: number;               // kW
  rotorRPM: number;                  // RPM
  generatorCurrent: number;          // Amps
  generatorVoltage: number;          // Volts
  bladeAngle: number;                // degrees
  hydraulicPressure: number;         // PSI
  vibration: number;                 // Hz
  nacelleBearing: number;            // Celsius
}

// Weather Data
interface WeatherData {
  timestamp: string;                 // ISO 8601
  turbineId: string;
  windSpeed: number;                 // m/s
  windDirection: number;             // degrees
  temperature: number;               // Celsius
  humidity: number;                  // %
  pressure: number;                  // hPa
  precipitation: number;             // mm
  cloudCover: number;                // %
}

// Energy Loss Tracking
interface EnergyLoss {
  timestamp: string;                 // ISO 8601
  turbineId: string;
  category: 'environmental' | 'technical' | 'operational';
  type: string;                      // e.g., "blade_pitch_error", "grid_unavailable"
  value: number;                     // MWh lost
  percentage: number;                // % of expected production
  description: string;
}

// Calculated KPIs
interface KPIs {
  // Resource Efficiency
  capacity_factor: number;           // %
  average_power_output: number;      // kW
  wind_utilization_rate: number;     // %
  
  // Reliability
  availability: number;              // %
  uptime: number;                    // %
  mean_time_to_failure: number;      // hours
  mean_time_to_repair: number;       // hours
  
  // Financial
  revenue_per_turbine: number;       // Currency units
  energy_sold: number;               // MWh
  imbalance_costs: number;           // Currency units
  forecast_accuracy: number;         // %
  
  // Health
  health_score: number;              // 0-100
  anomaly_detection_score: number;   // 0-100
  rul_prediction: number;            // Remaining Useful Life in hours
  maintenance_risk: number;          // 0-100
}
```

### 1.2 Current Mock Data Generation Functions

- `generateSites()` - Returns static site metadata
- `generateFarms()` - Returns static farm metadata
- `generateTurbines()` - Returns static turbine metadata
- `generateSCADAData(turbineId, hours)` - Generates random SCADA readings
- `calculateKPIs(scadaData)` - Calculates metrics from SCADA data
- `generateEnergyLosses()` - Generates mock energy loss events

---

## 2. Real-Time Data Integration Architecture

### 2.1 Recommended Architecture Pattern

```
┌─────────────────────┐
│  Wind Farm SCADA    │
│  Systems (Multiple) │
└──────────┬──────────┘
           │
           ├──────────────────────────────┐
           │                              │
    ┌──────▼──────┐           ┌──────────▼────────┐
    │ MQTT Broker │  or       │ REST API Gateway  │
    │ (Real-time) │           │ (Polling)         │
    └──────┬──────┘           └──────────┬────────┘
           │                             │
           └──────────────┬──────────────┘
                          │
                   ┌──────▼──────┐
                   │  Data Lake  │
                   │ (InfluxDB,  │
                   │ TimescaleDB)│
                   └──────┬──────┘
                          │
              ┌───────────┴───────────┐
              │                       │
        ┌─────▼─────┐         ┌──────▼──────┐
        │ WebSocket │         │ REST API    │
        │ Connection│         │ Endpoints   │
        └─────┬─────┘         └──────┬──────┘
              │                       │
              └───────────┬───────────┘
                          │
                   ┌──────▼───────┐
                   │  Next.js App │
                   │ Real-time UI │
                   └──────────────┘
```

### 2.2 Data Flow Diagram

**Real-Time Updates (5-10 second intervals):**
- Turbine SCADA → Message Broker → WebSocket → Dashboard (Live Charts)

**Historical Analysis (Daily/Hourly):**
- SCADA Data → Time-Series DB → API → Analytics Dashboard

**Alerts & Anomalies (Real-time):**
- Turbine Sensors → Rules Engine → Alert Service → Dashboard (Red Badge)

---

## 3. Required API Endpoints

All endpoints should return JSON format with proper HTTP status codes.

### 3.1 Site Management Endpoints

```http
GET /api/sites
Response: Array of Site objects
Query Parameters:
  - limit: number (default: 100)
  - offset: number (default: 0)
  - status: string (optional: "operational", "degraded", "offline")

GET /api/sites/:siteId
Response: Single Site object with aggregated metrics

GET /api/sites/:siteId/farms
Response: Array of Farm objects for the site

GET /api/sites/:siteId/metrics
Response: KPIs object
Query Parameters:
  - timeRange: string ("1h", "24h", "7d", "30d")
```

### 3.2 Farm Management Endpoints

```http
GET /api/farms
Response: Array of Farm objects
Query Parameters:
  - siteId: string (optional)
  - limit: number (default: 100)
  - offset: number (default: 0)

GET /api/farms/:farmId
Response: Single Farm object with real-time status

GET /api/farms/:farmId/turbines
Response: Array of Turbine objects

GET /api/farms/:farmId/metrics
Response: KPIs object aggregated from all turbines
Query Parameters:
  - timeRange: string ("1h", "24h", "7d", "30d")

GET /api/farms/:farmId/energy-generation
Response: Time-series energy generation data
Query Parameters:
  - startTime: ISO 8601 timestamp
  - endTime: ISO 8601 timestamp
  - interval: string ("5m", "15m", "1h")
```

### 3.3 Turbine Management Endpoints

```http
GET /api/turbines
Response: Array of Turbine objects
Query Parameters:
  - farmId: string (optional)
  - siteId: string (optional)
  - status: string (optional)
  - limit: number (default: 100)

GET /api/turbines/:turbineId
Response: Single Turbine object with current status

GET /api/turbines/:turbineId/scada
Response: Current SCADA data
Example Response:
{
  "timestamp": "2026-03-23T14:30:00Z",
  "turbineId": "turbine-001",
  "windSpeed": 8.5,
  "windDirection": 245,
  "temperature": 12.3,
  "powerOutput": 2850,
  "rotorRPM": 12.5,
  "generatorCurrent": 125.4,
  "generatorVoltage": 690,
  "bladeAngle": 25.3,
  "hydraulicPressure": 450,
  "vibration": 2.1,
  "nacelleBearing": 35.2
}

GET /api/turbines/:turbineId/scada/history
Response: Historical SCADA data
Query Parameters:
  - startTime: ISO 8601 timestamp
  - endTime: ISO 8601 timestamp
  - interval: string ("5m", "15m", "1h")

GET /api/turbines/:turbineId/metrics
Response: KPIs for single turbine
Query Parameters:
  - timeRange: string ("1h", "24h", "7d", "30d")

GET /api/turbines/:turbineId/health
Response: Health score and anomaly detection
Example Response:
{
  "turbineId": "turbine-001",
  "timestamp": "2026-03-23T14:30:00Z",
  "healthScore": 92,
  "anomalyScore": 8,
  "maintenanceRisk": 15,
  "rulPrediction": 3500,
  "status": "operational",
  "alerts": [
    {
      "severity": "warning",
      "message": "Vibration levels elevated",
      "timestamp": "2026-03-23T14:25:00Z"
    }
  ]
}

GET /api/turbines/:turbineId/energy-loss
Response: Energy loss analysis
Query Parameters:
  - startTime: ISO 8601 timestamp
  - endTime: ISO 8601 timestamp
Example Response:
{
  "turbineId": "turbine-001",
  "period": {
    "start": "2026-03-23T00:00:00Z",
    "end": "2026-03-23T23:59:59Z"
  },
  "totalLoss": 156.7,
  "losses": [
    {
      "timestamp": "2026-03-23T10:30:00Z",
      "category": "technical",
      "type": "blade_pitch_error",
      "value": 45.2,
      "percentage": 8.5,
      "description": "Blade pitch control malfunction"
    }
  ]
}
```

### 3.4 Analytics Endpoints

```http
GET /api/analytics/wind-speed-distribution
Response: Histogram data for wind speed distribution
Query Parameters:
  - siteId: string
  - startTime: ISO 8601 timestamp
  - endTime: ISO 8601 timestamp

GET /api/analytics/availability-heatmap
Response: Site/turbine availability matrix
Query Parameters:
  - siteId: string
  - startTime: ISO 8601 timestamp
  - endTime: ISO 8601 timestamp

GET /api/analytics/performance-comparison
Response: Cross-site performance comparison
Query Parameters:
  - startTime: ISO 8601 timestamp
  - endTime: ISO 8601 timestamp
  - metric: string ("generation", "revenue", "availability")

GET /api/analytics/revenue-loss-waterfall
Response: Revenue loss breakdown
Query Parameters:
  - siteId: string
  - startTime: ISO 8601 timestamp
  - endTime: ISO 8601 timestamp

GET /api/analytics/cumulative-generation
Response: Cumulative generation tracking
Query Parameters:
  - siteId: string
  - startTime: ISO 8601 timestamp
  - endTime: ISO 8601 timestamp
  - interval: string ("1h", "1d")
```

### 3.5 Real-Time WebSocket Endpoint

```javascript
// Connection
WebSocket: wss://api.example.com/ws/realtime

// Subscribe to updates
{
  "action": "subscribe",
  "channels": [
    "turbine:turbine-001:scada",
    "site:site-001:metrics",
    "farm:farm-001:alerts"
  ]
}

// Receive real-time SCADA data (every 5-10 seconds)
{
  "type": "scada_update",
  "turbineId": "turbine-001",
  "timestamp": "2026-03-23T14:30:00Z",
  "windSpeed": 8.5,
  "windDirection": 245,
  "temperature": 12.3,
  "powerOutput": 2850,
  "...": "..."
}

// Receive alerts in real-time
{
  "type": "alert",
  "severity": "warning",
  "turbineId": "turbine-001",
  "message": "Vibration levels exceeded threshold",
  "timestamp": "2026-03-23T14:30:00Z"
}

// Receive health updates
{
  "type": "health_update",
  "turbineId": "turbine-001",
  "healthScore": 92,
  "anomalyScore": 8,
  "timestamp": "2026-03-23T14:30:00Z"
}
```

---

## 4. Data Source Specifications

### 4.1 SCADA System Requirements

**Input Frequency:** 5-10 seconds (configurable)
**Data Quality:** At least 95% uptime
**Latency Tolerance:** < 30 seconds
**Data Retention:** Minimum 2 years

**Required SCADA Parameters per Turbine:**
- Wind speed (m/s)
- Wind direction (degrees)
- Temperature (°C)
- Power output (kW)
- Rotor RPM
- Generator current (Amps)
- Generator voltage (V)
- Blade angle (degrees)
- Hydraulic pressure (PSI)
- Vibration (Hz)
- Nacelle bearing temperature (°C)

### 4.2 Metadata Requirements

**Static Site Data (updated monthly):**
- Site ID, Name, Location, Country
- Installed capacity (MW)
- Number of turbines
- Operating date
- Owner/Operator
- Latitude, Longitude

**Static Farm Data (updated quarterly):**
- Farm ID, Name, Location
- Number of turbines
- Total capacity (MW)
- Power curve (MW rating)
- Design capacity (MW)
- Operating date
- Status

**Static Turbine Data (updated annually):**
- Turbine ID, Name
- Farm ID (parent farm)
- Capacity (MW)
- Latitude, Longitude
- Installation date
- Last maintenance date
- Maintenance schedule

### 4.3 External Data Sources

**Weather Forecast API (for comparison):**
- Provider: OpenWeatherMap, WeatherAPI, or equivalent
- Frequency: Hourly
- Parameters: Wind speed, wind direction, temperature, cloud cover

**Pricing Data (for revenue calculations):**
- Electricity price per MWh (hourly rates)
- Grid imbalance penalties
- Renewable energy certificates (REC) prices

---

## 5. Database Schema Requirements

### 5.1 Time-Series Database (Recommended: InfluxDB or TimescaleDB)

```sql
-- SCADA Measurements (InfluxDB format)
Measurement: scada_readings
Tags:
  - turbine_id
  - farm_id
  - site_id
Fields:
  - wind_speed (float)
  - wind_direction (float)
  - temperature (float)
  - power_output (float)
  - rotor_rpm (float)
  - generator_current (float)
  - generator_voltage (float)
  - blade_angle (float)
  - hydraulic_pressure (float)
  - vibration (float)
  - nacelle_bearing (float)
Timestamp: Precise to milliseconds

-- Energy Generation (aggregated)
Measurement: energy_generation
Tags:
  - turbine_id / farm_id / site_id
  - source: "actual" | "forecasted"
Fields:
  - energy_mwh (float)
  - revenue (float)
Timestamp: Hourly or 15-minute intervals

-- Alerts and Events
Measurement: alerts
Tags:
  - turbine_id
  - severity: "info" | "warning" | "critical"
  - category: "maintenance" | "performance" | "safety"
Fields:
  - message (string)
  - duration_minutes (int)
Timestamp: Event occurrence time

-- Health Metrics (calculated)
Measurement: health_metrics
Tags:
  - turbine_id
Fields:
  - health_score (float, 0-100)
  - anomaly_score (float, 0-100)
  - maintenance_risk (float, 0-100)
  - rul_prediction (float, hours)
Timestamp: Calculation time
```

### 5.2 Relational Database (PostgreSQL/MySQL)

```sql
-- Master Data Tables
CREATE TABLE sites (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  country VARCHAR(100),
  total_capacity DECIMAL(10,2),
  total_turbines INT,
  operating_date DATE,
  owner VARCHAR(255),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE farms (
  id UUID PRIMARY KEY,
  site_id UUID REFERENCES sites(id),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  turbine_count INT,
  total_capacity DECIMAL(10,2),
  status ENUM('operational', 'degraded', 'offline'),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  operating_date DATE,
  design_capacity DECIMAL(10,2),
  power_curve DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE turbines (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  name VARCHAR(255) NOT NULL,
  capacity DECIMAL(10,2),
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  status ENUM('operational', 'maintenance', 'offline', 'error'),
  last_maintenance_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Real-Time Data (Time-Series DB)
-- Use InfluxDB or TimescaleDB instead of relational DB

-- Energy Loss Events
CREATE TABLE energy_losses (
  id UUID PRIMARY KEY,
  turbine_id UUID REFERENCES turbines(id),
  timestamp TIMESTAMP NOT NULL,
  category VARCHAR(50),
  type VARCHAR(100),
  value_mwh DECIMAL(10,2),
  percentage DECIMAL(5,2),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_turbine_timestamp (turbine_id, timestamp DESC)
);

-- Maintenance Records
CREATE TABLE maintenance_records (
  id UUID PRIMARY KEY,
  turbine_id UUID REFERENCES turbines(id),
  maintenance_date DATE NOT NULL,
  type VARCHAR(100),
  description TEXT,
  duration_hours INT,
  cost DECIMAL(15,2),
  parts_replaced TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_turbine_date (turbine_id, maintenance_date DESC)
);

-- Alerts History
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  turbine_id UUID REFERENCES turbines(id),
  timestamp TIMESTAMP NOT NULL,
  severity VARCHAR(50),
  category VARCHAR(50),
  message TEXT,
  resolved_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_turbine_timestamp (turbine_id, timestamp DESC)
);
```

---

## 6. Integration Steps

### Phase 1: API Gateway Setup (Week 1)
1. Set up REST API endpoints as specified in Section 3
2. Implement basic authentication/authorization
3. Deploy API gateway with rate limiting and caching
4. Test endpoint responses with Postman/Thunder Client

### Phase 2: Data Source Connection (Week 2)
1. Connect to SCADA systems via MQTT or REST polling
2. Validate data quality and completeness
3. Set up data transformation/normalization pipeline
4. Store historical data in time-series database

### Phase 3: WebSocket Implementation (Week 3)
1. Implement WebSocket server for real-time updates
2. Set up subscription management
3. Configure broadcasting of SCADA updates (5-10 sec intervals)
4. Test latency and connection stability

### Phase 4: Dashboard Integration (Week 4)
1. Replace mock data functions with API calls
2. Implement real-time WebSocket listeners
3. Update all chart components with live data
4. Add error handling and data validation
5. Performance testing and optimization

### Phase 5: Production Deployment (Week 5)
1. Load testing (>1000 concurrent connections)
2. Security audit and penetration testing
3. Monitoring setup (Datadog, New Relic, etc.)
4. Disaster recovery and failover testing
5. Go-live and monitoring

---

## 7. Code Changes Required

### 7.1 Replace Mock Data Imports

**Current (Mock):**
```typescript
import { generateSites, generateFarms, generateSCADAData } from '@/lib/mockData';
const sites = generateSites();
```

**New (Real-time):**
```typescript
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

const [sites, setSites] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  apiClient.get('/api/sites').then(data => {
    setSites(data);
    setLoading(false);
  });
}, []);
```

### 7.2 WebSocket Integration

```typescript
// hooks/useRealtimeData.ts
import { useEffect, useRef } from 'react';

export function useRealtimeData(turbineId: string, onUpdate: (data: SCADAData) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('wss://api.example.com/ws/realtime');
    
    wsRef.current.onopen = () => {
      wsRef.current?.send(JSON.stringify({
        action: 'subscribe',
        channels: [`turbine:${turbineId}:scada`]
      }));
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'scada_update') {
        onUpdate(message);
      }
    };

    return () => wsRef.current?.close();
  }, [turbineId]);
}
```

### 7.3 API Client Setup

```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = {
  async get(endpoint: string, params?: Record<string, any>) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
};
```

---

## 8. Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_WS_URL=wss://api.example.com
API_AUTH_TOKEN=your_api_key_here
SCADA_SYSTEM_URL=https://scada.example.com
INFLUXDB_URL=https://influxdb.example.com
INFLUXDB_TOKEN=your_influx_token
INFLUXDB_ORG=your_organization
INFLUXDB_BUCKET=wind_farm_data
```

---

## 9. Success Criteria & Testing

### 9.1 Performance Benchmarks
- Dashboard load time: < 2 seconds
- Real-time chart updates: < 500ms latency
- API response time: < 200ms (p95)
- WebSocket connection stability: 99.9% uptime
- Data accuracy: ± 2% variance from source SCADA

### 9.2 Testing Checklist
- [ ] All API endpoints return correct data structure
- [ ] WebSocket connections handle 1000+ concurrent clients
- [ ] Real-time updates propagate within 10 seconds
- [ ] Error handling for network failures
- [ ] Data validation for all incoming values
- [ ] Historical data queries return correct aggregations
- [ ] Authentication/authorization working correctly
- [ ] Load testing shows no performance degradation

### 9.3 Monitoring Requirements
- Real-time dashboard metric tracking
- API endpoint response time monitoring
- WebSocket connection health monitoring
- Data freshness indicators (last update timestamp)
- Error rate tracking and alerting
- Database query performance monitoring

---

## 10. Support & Maintenance

### 10.1 Data Backup Strategy
- Daily automated backups of relational database
- Continuous backup of time-series data (rolling 30-day buffer)
- Disaster recovery plan with RTO < 4 hours, RPO < 1 hour

### 10.2 Update Frequency
- SCADA readings: Every 5-10 seconds (configurable)
- Calculated metrics (KPIs): Every 15 minutes
- Maintenance records: Manual updates (immediately)
- Site/Farm metadata: Quarterly reviews
- Forecasted data: Daily updates at 06:00 UTC

### 10.3 Data Retention Policy
- Real-time SCADA: 30 days (in-memory/hot storage)
- Aggregated metrics: 2 years (cold storage)
- Alerts: 1 year
- Maintenance records: 5 years (audit trail)

---

## 11. Security Requirements

### 11.1 Authentication
- API Key authentication for server-to-server calls
- JWT tokens with 1-hour expiration for user sessions
- Multi-factor authentication for admin access

### 11.2 Data Encryption
- TLS 1.3 for all data in transit
- AES-256 encryption for data at rest (database)
- Field-level encryption for sensitive parameters

### 11.3 Access Control
- Role-based access control (RBAC): Admin, Operator, Viewer
- Site-level data segregation (users only see assigned sites)
- Audit logging for all data access

### 11.4 API Rate Limiting
- 1000 requests/minute per IP address
- 100 requests/minute per API key
- WebSocket connection limits: Max 1000 connections per server

---

## 12. Contact & Escalation

**Technical Support:**
- Email: tech-support@example.com
- Slack: #wind-portal-support
- Response Time: < 2 hours for critical issues

**Data Integration Questions:**
- Contact: data-engineering@example.com
- Office Hours: 09:00-17:00 UTC

**API Documentation:**
- Swagger/OpenAPI: https://api.example.com/docs
- Postman Collection: https://api.example.com/postman-collection

---

## Appendix A: Sample API Response Formats

### Real-Time Turbine SCADA Response
```json
{
  "success": true,
  "timestamp": "2026-03-23T14:30:00Z",
  "data": {
    "turbineId": "turbine-001",
    "windSpeed": 8.5,
    "windDirection": 245,
    "temperature": 12.3,
    "powerOutput": 2850,
    "rotorRPM": 12.5,
    "generatorCurrent": 125.4,
    "generatorVoltage": 690,
    "bladeAngle": 25.3,
    "hydraulicPressure": 450,
    "vibration": 2.1,
    "nacelleBearing": 35.2
  }
}
```

### Site Analytics Response
```json
{
  "success": true,
  "siteId": "site-001",
  "period": {
    "start": "2026-03-23T00:00:00Z",
    "end": "2026-03-23T23:59:59Z"
  },
  "metrics": {
    "totalGeneration": 2755,
    "budgetedGeneration": 2410,
    "variance": 345,
    "variancePercent": 14.3,
    "totalRevenue": 0.77,
    "avgCapacityFactor": 32.5,
    "avgAvailability": 96.2,
    "energyLosses": [
      {
        "category": "technical",
        "type": "blade_pitch_error",
        "value": 45.2,
        "percentage": 8.5
      }
    ]
  }
}
```

---

**Document Prepared By:** Wind Analytics Team  
**For Questions:** contact your project manager
