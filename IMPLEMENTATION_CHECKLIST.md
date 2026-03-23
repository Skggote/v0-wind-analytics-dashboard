# Real-Time Implementation - Quick Reference Checklist

## Phase 1: Data Source Setup (Week 1)

### SCADA System Connection
- [ ] Identify all SCADA systems and their APIs/protocols (REST, MQTT, OPC-UA)
- [ ] Document SCADA data format and update frequency (typically 5-10 seconds)
- [ ] Test connectivity to each SCADA source
- [ ] Validate data quality (missing values, outliers, accuracy)
- [ ] Set up data transformation pipeline for normalization
- [ ] Document all SCADA parameter mappings (e.g., windSpeed in m/s)

### Time-Series Database Setup
- [ ] Deploy InfluxDB or TimescaleDB (recommend: InfluxDB for wind data)
- [ ] Configure retention policies (hot: 30 days, cold: 2 years)
- [ ] Create measurement buckets:
  - `scada_readings` (real-time turbine data)
  - `energy_generation` (aggregated metrics)
  - `alerts` (event logs)
  - `health_metrics` (calculated scores)
- [ ] Set up automated backups with daily snapshots
- [ ] Configure monitoring and alerting for database health

### Master Data (Relational DB)
- [ ] Set up PostgreSQL or MySQL instance
- [ ] Create tables: sites, farms, turbines, maintenance_records, energy_losses
- [ ] Populate static data (farm locations, turbine specs)
- [ ] Index on frequently queried columns (turbine_id, site_id, timestamp)
- [ ] Set up connection pooling (min: 5, max: 20 connections)

**Estimated Effort:** 40-50 hours  
**Key Dependencies:** SCADA system documentation, database administration access

---

## Phase 2: REST API Development (Week 2)

### Base Infrastructure
- [ ] Set up Node.js/Express or Django backend
- [ ] Configure request logging and monitoring
- [ ] Implement global error handling middleware
- [ ] Set up API rate limiting (1000 req/min per IP)
- [ ] Enable CORS for frontend domain
- [ ] Add request validation using Zod or Joi

### Core Endpoints (Priority: HIGH)

**Sites API**
```
GET /api/sites                    → List all sites
GET /api/sites/:id               → Single site details
GET /api/sites/:id/metrics       → Site KPIs
GET /api/sites/:id/farms         → Farms in site
```

**Farms API**
```
GET /api/farms                    → List all farms
GET /api/farms/:id               → Farm details
GET /api/farms/:id/turbines      → Turbines in farm
GET /api/farms/:id/metrics       → Farm KPIs
```

**Turbines API**
```
GET /api/turbines                → List turbines
GET /api/turbines/:id            → Turbine details
GET /api/turbines/:id/scada      → Current SCADA data
GET /api/turbines/:id/scada/history → Historical SCADA (24h window)
GET /api/turbines/:id/health     → Health score
GET /api/turbines/:id/energy-loss → Energy loss analysis
```

**Analytics API**
```
GET /api/analytics/wind-speed-distribution
GET /api/analytics/availability-heatmap
GET /api/analytics/performance-comparison
GET /api/analytics/revenue-loss-waterfall
GET /api/analytics/cumulative-generation
```

### Testing & Validation
- [ ] Test all endpoints with Postman/Insomnia
- [ ] Validate response formats match specification
- [ ] Test pagination (limit, offset parameters)
- [ ] Test date/time filtering
- [ ] Load test with 100+ concurrent requests
- [ ] Document API response times (target: <200ms p95)

**Estimated Effort:** 60-80 hours  
**Key Libraries:** Express.js, axios/node-fetch, query-builder (Knex, TypeORM)

---

## Phase 3: WebSocket Real-Time Layer (Week 3)

### WebSocket Server Setup
- [ ] Install WebSocket library (ws or Socket.io)
- [ ] Configure server to handle 1000+ concurrent connections
- [ ] Implement connection management:
  - [ ] Connection pooling and tracking
  - [ ] Graceful disconnect handling
  - [ ] Automatic reconnection on client side (exponential backoff)
  - [ ] Health checks / ping-pong every 30 seconds

### Message Protocol Implementation
- [ ] Subscribe/unsubscribe message handling
- [ ] Real-time SCADA broadcast (5-10 second intervals)
- [ ] Alert broadcasting with severity levels
- [ ] Health update streaming
- [ ] Error message broadcasting

### Example Message Flow
```javascript
// Client subscribes
{ "action": "subscribe", "channels": ["turbine:001:scada", "site:001:alerts"] }

// Server broadcasts SCADA every 5 seconds
{ "type": "scada_update", "turbineId": "001", "powerOutput": 2850, ... }

// Server broadcasts alerts in real-time
{ "type": "alert", "severity": "warning", "message": "...", ... }
```

### Testing & Optimization
- [ ] Test with concurrent connections: 100, 500, 1000
- [ ] Measure message latency (target: <500ms)
- [ ] Verify reconnection handling
- [ ] Load test for memory leaks (run 24+ hours)
- [ ] Monitor CPU usage during peak load

**Estimated Effort:** 40-60 hours  
**Key Libraries:** ws, Socket.io, or native Node.js WebSocket

---

## Phase 4: Frontend Integration (Week 4)

### Replace Mock Data Functions
- [ ] Identify all files using `generateSites()`, `generateFarms()`, etc.
- [ ] Create `lib/api-client.ts` (see REAL_TIME_DEVELOPER_GUIDE.md)
- [ ] Create `hooks/usePollingData.ts` (for REST polling)
- [ ] Create `hooks/useRealtimeScada.ts` (for WebSocket)
- [ ] Files to update:
  - [ ] `app/page.tsx` (Dashboard)
  - [ ] `app/sites/page.tsx` (Sites)
  - [ ] `app/sites/[id]/page.tsx` (Site Details)
  - [ ] `app/analytics/page.tsx` (Analytics)
  - [ ] `app/turbines/page.tsx` (Turbines)
  - [ ] All custom components using mock data

### Update Configuration
- [ ] Update `.env.local` with API URLs:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:3001
  NEXT_PUBLIC_WS_URL=ws://localhost:3001
  ```
- [ ] Update production `.env.production` for deployed environment

### Component Updates (Sample Pattern)

**Before:**
```typescript
const [data] = useState(() => generateSites());
```

**After:**
```typescript
const { data, loading, error } = usePollingData('/api/sites', {
  interval: 30000
});
if (loading) return <Loader />;
if (error) return <Error msg={error.message} />;
```

### Chart Components
- [ ] Update all LineChart components to use live SCADA data
- [ ] Update AreaChart components for energy generation
- [ ] Update BarChart components for comparisons
- [ ] Add loading skeletons while data fetches
- [ ] Add error boundaries around charts

### Testing Before Deploy
- [ ] [ ] Test all pages load without errors
- [ ] [ ] Charts render with real data
- [ ] [ ] Real-time updates work (check timestamp updates)
- [ ] [ ] Responsive design works on mobile
- [ ] [ ] Error handling shows proper messages
- [ ] [ ] Performance: Dashboard loads in <2 seconds

**Estimated Effort:** 50-70 hours  
**Key Dependencies:** Completed REST API and WebSocket servers

---

## Phase 5: Production Deployment (Week 5)

### Pre-Production Testing
- [ ] Load testing: 100 concurrent users → check response times
- [ ] Soak testing: Run for 24 hours → check memory/CPU
- [ ] Failover testing: Stop database → check error handling
- [ ] Data accuracy: Compare API results with source SCADA (±2% tolerance)
- [ ] Security scanning: OWASP Top 10 review
- [ ] Database backup/restore testing

### Infrastructure Preparation
- [ ] Deploy backend API (can use Vercel, Railway, Render, AWS, GCP, Azure)
- [ ] Deploy frontend to Vercel (or your preferred host)
- [ ] Set up SSL/TLS certificates
- [ ] Configure CDN for static assets (Vercel Edge, Cloudflare)
- [ ] Set up database backup automation
- [ ] Configure monitoring:
  - [ ] Datadog, New Relic, or CloudWatch
  - [ ] Application Performance Monitoring (APM)
  - [ ] Real-time alerts for:
    - [ ] API response time > 500ms
    - [ ] Error rate > 1%
    - [ ] WebSocket connections < threshold
    - [ ] Database query time > 1 second
    - [ ] SCADA data freshness > 30 seconds

### Security Hardening
- [ ] Enable HTTPS/TLS everywhere
- [ ] Implement JWT token authentication
- [ ] Rate limiting on all APIs
- [ ] CORS whitelist only frontend domain
- [ ] SQL injection protection (parameterized queries)
- [ ] WebSocket authentication/authorization
- [ ] API keys rotation schedule (quarterly)
- [ ] Enable audit logging for data access

### Deployment Steps
1. [ ] Deploy backend to production environment
2. [ ] Verify all APIs are accessible
3. [ ] Deploy frontend
4. [ ] Update environment variables
5. [ ] Run smoke tests (sample requests to all endpoints)
6. [ ] Monitor logs for 24 hours post-deployment
7. [ ] Get sign-off from client
8. [ ] Document deployment runbook for future updates

### Post-Deployment
- [ ] Monitor error rates and latency
- [ ] Set up on-call rotation
- [ ] Create incident response playbooks
- [ ] Schedule weekly performance reviews
- [ ] Plan optimization based on actual usage patterns

**Estimated Effort:** 30-40 hours  
**Key Tools:** Docker, Kubernetes (optional), monitoring tools, deployment tools

---

## Data Quality Checklist

### Real-Time SCADA Data
- [ ] **Frequency:** Data arriving every 5-10 seconds (no gaps > 1 minute)
- [ ] **Accuracy:** ±2% from source system
- [ ] **Completeness:** <1% missing values
- [ ] **Freshness:** Current data is <30 seconds old
- [ ] **Validation Rules:**
  - [ ] Wind speed: 0-25 m/s
  - [ ] Temperature: -30 to +60°C
  - [ ] Power output: 0 to turbine capacity
  - [ ] Rotor RPM: 0-15 RPM
  - [ ] Blade angle: 0-90 degrees

### Calculated Metrics (KPIs)
- [ ] **Update Frequency:** Every 15 minutes (minimum)
- [ ] **Calculation Accuracy:** Validated against manual calculations
- [ ] **Availability:** <0.1% downtime
- [ ] **Sample KPI Validation:**
  - [ ] Capacity Factor: Sum(Energy Generated) / (Capacity × Hours)
  - [ ] Availability: (Uptime Hours / Total Hours) × 100
  - [ ] Revenue: Energy Generated × $/MWh

---

## Critical Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| API Response Time | <200ms p95 | Monitor via APM tool |
| WebSocket Latency | <500ms | WebSocket message timestamps |
| Data Freshness | <30 seconds | Compare API timestamp with current time |
| System Uptime | 99.9% | Monitoring service uptime percentage |
| Dashboard Load Time | <2 seconds | Frontend analytics |
| Real-Time Chart Update | <5 seconds | Visual inspection + timing logs |
| Error Rate | <0.1% | API/Application error logging |
| Data Accuracy | ±2% | Compare with source SCADA |
| Availability Score | >98% | KPI calculation verification |

---

## Rollback Plan

If something goes wrong in production:

### Rollback Steps
1. [ ] Revert to previous API version (maintain 2 versions in parallel)
2. [ ] Revert to previous frontend version
3. [ ] Restore database from latest backup
4. [ ] Clear CDN cache
5. [ ] Verify all systems functional
6. [ ] Post-mortem analysis
7. [ ] Deploy fix to staging first
8. [ ] Validate thoroughly before re-deploying

### Timeline
- **T+0min:** Detect issue via monitoring alert
- **T+5min:** Initial investigation and impact assessment
- **T+10min:** Begin rollback procedure
- **T+15min:** Rollback complete
- **T+20min:** Verification and customer communication
- **Target RTO:** 15-30 minutes

---

## Documentation to Prepare for Client

**Provide these documents:**
1. ✅ REALTIME_INTEGRATION_REQUIREMENTS.md (business requirements)
2. ✅ REAL_TIME_DEVELOPER_GUIDE.md (technical implementation)
3. ✅ API_DOCUMENTATION.md (detailed endpoint specs)
4. [ ] DEPLOYMENT_RUNBOOK.md (operations team)
5. [ ] MONITORING_GUIDE.md (SRE team)
6. [ ] TROUBLESHOOTING_GUIDE.md (support team)
7. [ ] ARCHITECTURE_DIAGRAM.md (with visual diagrams)

---

## Cost Estimation

### Infrastructure (Monthly)
- Database (InfluxDB Cloud or self-hosted): $200-500
- Backend API hosting (Vercel, Railway, AWS): $100-300
- Frontend hosting: $0-20 (Vercel)
- Monitoring/Logging (Datadog, etc.): $100-200
- **Total:** $400-1000/month

### Development (One-time)
- Backend API development: 60-80 hours @ $150/hr = $9,000-$12,000
- WebSocket implementation: 40-60 hours @ $150/hr = $6,000-$9,000
- Frontend integration: 50-70 hours @ $150/hr = $7,500-$10,500
- Testing & QA: 30-40 hours @ $120/hr = $3,600-$4,800
- Deployment & DevOps: 30-40 hours @ $150/hr = $4,500-$6,000
- **Total:** $30,600-$42,300 (3-4 months for full team)

---

## Communication Timeline

- **Week 1:** Data source readiness review meeting
- **Week 2:** API specification sign-off
- **Week 3:** WebSocket architecture review
- **Week 4:** Testing & UAT scheduling
- **Week 5:** Production deployment plan review
- **Day of Go-Live:** Real-time monitoring & support team standby

---

**Questions?** Contact the development team for clarification on any item.  
**Status Updates:** Weekly sync meetings recommended during implementation.
