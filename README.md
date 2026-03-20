# WindFlow - Advanced AI Wind Farm Analytics Dashboard

A comprehensive, production-ready wind farm analytics platform built with Next.js 16, React, and Node.js. Features real-time monitoring, AI-powered insights, predictive analytics, and advanced KPI tracking for wind energy operations.

## Features

### Core Dashboard
- **Real-Time KPI Monitoring**: 20+ key performance indicators across resource efficiency, reliability, financial, and health metrics
- **Interactive Visualizations**: 5+ chart types (line, area, bar, scatter, pie) for comprehensive data analysis
- **Global Filters**: Date range, farm, turbine status, and aggregation level filtering
- **Drill-Down Navigation**: Portfolio → Farm → Turbine → Component level analysis

### Fleet Management
- **Spatial Turbine View**: Grid-based turbine layout with status visualization
- **Fleet Status Tracking**: Real-time operational, maintenance, offline, and error status monitoring
- **Detailed Fleet Table**: Comprehensive turbine information including last maintenance, capacity, health scores
- **Timeline Events**: Historical event tracking and status changes

### Predictive Maintenance
- **RUL Predictions**: Remaining useful life predictions for critical components
- **Health Score Degradation**: Track component degradation trends over time
- **Maintenance Scheduling**: AI-powered maintenance planning and prioritization
- **Risk Assessment**: Quantified risk levels for each turbine

### Performance Optimization
- **What-If Scenarios**: Simulate impact of various optimization strategies
- **Efficiency Measures**: Evaluate blade pitch control, yaw alignment, and other improvements
- **Revenue Optimization**: Dispatch strategy optimization and imbalance cost reduction
- **ROI Analysis**: Calculate return on investment for improvements

### Analytics & Reporting
- **Historical Trends**: Monthly revenue, efficiency, maintenance cost analysis
- **Performance Metrics**: 6-month performance summaries and key insights
- **Anomaly Analysis**: Detection and resolution trend tracking
- **Export Capabilities**: Generate and export comprehensive reports

### AI Co-Pilot
- **Natural Language Queries**: Ask questions about anomalies, maintenance, forecasts
- **Intelligent Recommendations**: AI-powered actionable insights and optimization tips
- **Alert Explanation**: Understand why anomalies occurred and recommended actions
- **Chat Interface**: Interactive conversation-based analytics

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19, TypeScript)
- **UI Components**: shadcn/ui with Tailwind CSS v4
- **Charts**: Recharts for data visualization
- **Styling**: Modern dark theme with semantic design tokens

### Backend
- **Runtime**: Node.js with Next.js API routes
- **Data Generation**: Mock SCADA data generator with realistic wind patterns
- **KPI Calculation**: Real-time KPI computation services
- **Caching**: In-memory data caching for performance

### Architecture
- **Component-Based**: Reusable UI components (KPICard, Charts, Filters)
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type-Safe**: Full TypeScript support for type safety

## Project Structure

```
├── app/
│   ├── layout.tsx                 # Root layout with navigation
│   ├── page.tsx                   # Main dashboard
│   ├── fleet/page.tsx             # Fleet management
│   ├── maintenance/page.tsx       # Predictive maintenance
│   ├── optimization/page.tsx      # Performance optimization
│   ├── analytics/page.tsx         # Analytics & reporting
│   ├── copilot/page.tsx           # AI Co-Pilot
│   └── globals.css                # Global styles & design tokens
├── components/
│   ├── Navigation.tsx             # Main navigation
│   ├── KPICard.tsx                # KPI card component
│   ├── DashboardFilters.tsx       # Global filter controls
│   ├── DashboardCharts.tsx        # Chart components
│   └── ui/                        # shadcn/ui components
├── lib/
│   ├── mockData.ts                # Mock data generator & KPI calculations
│   └── utils.ts                   # Utility functions
└── public/                        # Static assets
```

## KPI Metrics

### Resource Efficiency
- Capacity Factor (%)
- Average Power Output (kW)
- Wind Utilization Rate (%)
- Energy Sold (MWh)

### Reliability
- Availability (%)
- Uptime (%)
- Mean Time to Failure (hours)
- Mean Time to Repair (hours)

### Financial
- Revenue per Turbine (USD)
- Imbalance Costs (USD)
- Forecast Accuracy (%)
- Expected Monthly Revenue (USD)

### Health & Maintenance
- Fleet Health Score (%)
- Anomaly Detection Score (%)
- RUL Prediction (months)
- Maintenance Risk (%)

## Getting Started

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd wind-farm-dashboard

# Install dependencies using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Running the Application
```bash
# Development server
pnpm dev

# Production build
pnpm build
pnpm start
```

The dashboard will be available at `http://localhost:3000`

## Mock Data

The dashboard uses a comprehensive mock data generator that simulates:

- **SCADA Data**: Realistic wind speed, power output, temperature, vibration patterns
- **Farm Data**: Multiple wind farms with varying turbine counts and capacities
- **Anomalies**: Realistic anomaly events with severity levels
- **Forecasts**: 7-day wind and power forecasts with confidence intervals

The mock generator uses realistic wind patterns (stronger at night) and power output curves based on wind speed.

## Key Features by Page

### Dashboard (/)
Main overview with all key metrics, resource efficiency, reliability, financial performance, and health monitoring.

### Fleet (/fleet)
Comprehensive fleet management with spatial turbine visualization, detailed status tracking, and timeline events.

### Maintenance (/maintenance)
Predictive maintenance planning with RUL predictions, health degradation tracking, and scheduled maintenance planning.

### Optimization (/optimization)
What-if scenario analysis for performance improvements, efficiency measures evaluation, and AI recommendations.

### Analytics (/analytics)
Historical trend analysis, KPI trends, revenue analysis, anomaly detection trends, and detailed performance insights.

### AI Co-Pilot (/copilot)
Intelligent chat interface for natural language queries about fleet performance, maintenance recommendations, and insights.

## Design System

### Color Palette
- **Primary**: Electric Blue (#003D99 - oklch(0.55 0.25 210))
- **Accent**: Bright Blue (#0066CC - oklch(0.65 0.22 210))
- **Success**: Green (#22C55E - oklch(0.65 0.2 120))
- **Warning**: Yellow (#EAB308 - oklch(0.65 0.2 30))
- **Danger**: Red (#EF4444 - oklch(0.5 0.2 25))
- **Neutral**: Grayscale (oklch variations)

### Typography
- **Fonts**: Geist (sans-serif), Geist Mono (monospace)
- **Headings**: Bold, tracking-tight
- **Body**: 14px base with 1.4-1.6 line-height

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Optimized for mobile, tablet, and desktop views

## Performance Optimizations

- **Responsive Charts**: Optimized for various screen sizes
- **Client-Side Caching**: Mock data cached for performance
- **Component-Based**: Efficient re-rendering with React best practices
- **Lazy Loading**: Charts and heavy components load efficiently
- **CSS-in-JS**: Tailwind CSS for minimal bundle size

## Future Enhancements

- Real-time WebSocket integration for live SCADA data
- Database integration (Supabase, Neon, or AWS Aurora)
- User authentication and role-based access control
- Custom dashboard builder for user-specific KPIs
- Advanced anomaly detection with machine learning
- Integration with external weather APIs
- Mobile app with push notifications
- API documentation and integration endpoints

## Architecture Highlights

### Mock Data System
The `lib/mockData.ts` file provides:
- Farm and turbine data generation
- SCADA data simulation with realistic patterns
- KPI calculation algorithms
- Time-series data aggregation
- Anomaly event generation

### Component Architecture
- **KPICard**: Status-aware card with trends and targets
- **DashboardCharts**: Multiple chart types with consistent styling
- **DashboardFilters**: Global filter system for all dashboards
- **Navigation**: Responsive navigation with mobile support

### KPI Calculation
KPIs are calculated in real-time from SCADA data:
```typescript
calculateKPIs(scadaData: SCADAData[], turbineCapacity: number): KPIs
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## License

Proprietary - All rights reserved

## Support

For issues, feature requests, or documentation, please contact the development team.

---

**Built with Next.js 16, React 19, and Recharts** | Production-Ready Wind Farm Analytics
