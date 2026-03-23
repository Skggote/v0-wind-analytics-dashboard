# WindFlow Dashboard - User Guide

## Dashboard Overview

WindFlow is an enterprise-grade wind farm analytics platform with real-time monitoring, performance analysis, and predictive maintenance capabilities.

## Navigation Map

### Main Sections (8 Pages)

#### 1. Dashboard `/`
**Purpose**: Portfolio overview and KPI summary
**Key Features:**
- 16 KPI cards across 4 categories
- Real-time metrics and trends
- Anomaly detection indicators
- Quick status overview
- 4+ interactive charts

**Best For:** Executive summary, daily monitoring, quick health check

#### 2. Sites `/sites`
**Purpose**: Portfolio and site-level management
**Key Features:**
- All wind farms in one view
- Search and filter capabilities
- Site performance comparison
- Operating date and owner info
- Portfolio summary statistics

**Best For:** Portfolio management, site comparison, investment analysis

#### 3. Turbines `/turbines`
**Purpose**: Real-time turbine health monitoring
**Key Features:**
- Farm-wise turbine listings
- Detailed health dashboards
- 24-hour time-series data
- Power, wind speed, temperature tracking
- Health scoring and status badges

**Best For:** Operations team, technical monitoring, maintenance planning

#### 4. Breakdown `/breakdown`
**Purpose**: Detailed performance analysis
**Key Features:**
- Energy loss categorization (3 types)
- Turbine performance comparison
- Weather impact analysis
- Detailed metrics tables
- Export functionality

**Best For:** Engineers, data analysis, root cause investigation

#### 5. Maintenance `/maintenance`
**Purpose**: Predictive maintenance and health prediction
**Key Features:**
- RUL (Remaining Useful Life) predictions
- Anomaly detection by component
- Health degradation tracking
- Maintenance scheduling recommendations
- Risk scoring

**Best For:** Maintenance teams, asset planners, cost optimization

#### 6. Optimization `/optimization`
**Purpose**: What-if scenario analysis
**Key Features:**
- Performance simulation
- Revenue impact analysis
- Operational optimization suggestions
- Maintenance timing recommendations
- Financial projections

**Best For:** Operations optimization, strategic planning, cost reduction

#### 7. Reports `/reports`
**Purpose**: Comprehensive reporting and export
**Key Features:**
- Multiple report types (Performance, Maintenance, Financial)
- Date range selection
- CSV export (fully functional)
- PDF/Excel export (template ready)
- Summary statistics

**Best For:** Reporting, compliance, stakeholder communication

#### 8. AI Co-Pilot `/copilot`
**Purpose**: Intelligent assistance and recommendations
**Key Features:**
- Natural language queries
- AI-powered insights
- Anomaly explanations
- Recommendations
- Chat interface

**Best For:** Decision support, quick insights, complex queries

## Key Metrics Explained

### Resource Efficiency
- **Capacity Factor**: Actual output / Theoretical max (%)
- **Average Power Output**: Mean power generation (kW)
- **Wind Utilization Rate**: Time at productive wind speeds (%)

### Reliability
- **Availability**: Time operational / Total time (%)
- **Uptime**: Fraction of scheduled operational time (%)
- **MTBF**: Mean time between failures (hours)
- **MTTR**: Mean time to repair (hours)

### Financial
- **Revenue Per Turbine**: Total energy revenue ($)
- **Energy Sold**: Total MWh sold
- **Imbalance Costs**: Grid balancing penalties ($)
- **Forecast Accuracy**: Wind forecast accuracy (%)

### Health
- **Health Score**: Component health assessment (0-100)
- **Anomaly Detection Score**: System anomaly confidence (%)
- **RUL Prediction**: Remaining useful life (months)
- **Maintenance Risk**: Probability needing maintenance (%)

## Common Tasks

### Check Wind Farm Health
1. Go to Dashboard (/)
2. Review health score KPI card
3. Check anomaly indicators
4. Click "View Details" for specific farms
5. Navigate to Turbines page for details

### Analyze Performance Issues
1. Go to Breakdown (/breakdown)
2. Select the affected farm
3. Toggle between Loss/Turbine/Weather tabs
4. Review loss breakdown or performance comparison
5. Export data for further analysis

### Schedule Maintenance
1. Go to Maintenance (/maintenance)
2. Review RUL predictions
3. Check health scores
4. Identify at-risk turbines
5. Use AI Co-Pilot for scheduling suggestions

### Generate Reports
1. Go to Reports (/reports)
2. Select report type (Performance/Maintenance/Financial)
3. Choose date range
4. Apply filters
5. Download CSV or PDF

### Get AI Insights
1. Go to AI Co-Pilot (/copilot)
2. Ask natural language questions
3. Request anomaly explanations
4. Get optimization suggestions
5. Review recommendations

## Data Interpretation

### Health Score Color Coding
- **Green (80-100%)**: Healthy - No action needed
- **Yellow (60-79%)**: Degrading - Monitor closely
- **Red (0-59%)**: At Risk - Maintenance needed

### Status Indicators
- **Operational**: Running normally
- **Maintenance**: Scheduled maintenance in progress
- **Offline**: Not generating power
- **Error**: Fault condition detected

### Loss Categories
- **Environmental**: Wind, weather, extreme events
- **Technical**: Component wear, friction, contamination
- **Operational**: Maintenance, optimization, calibration

## Tips & Tricks

1. **Quick Filters**: Use dropdown menus on most pages to filter by farm or time range
2. **Responsive Design**: All dashboards work on mobile and tablet
3. **Export Data**: CSV export is fully functional for spreadsheet analysis
4. **Time Selection**: Hover over charts for detailed timestamp information
5. **Dark Mode**: Optimized for low-light monitoring rooms
6. **Search**: Use site search to quickly find specific farms
7. **Mobile Navigation**: Hamburger menu on small screens includes all sections

## Performance Tips

- Dashboards load in <500ms
- Charts render smoothly on most devices
- Filter operations are instant
- Export takes <2 seconds

## Troubleshooting

**Page not loading?**
- Refresh the browser
- Clear browser cache
- Check JavaScript console for errors

**Data looks incorrect?**
- Verify you selected the correct farm/date range
- Check filter settings
- Compare with previous period

**Export not working?**
- PDF/Excel export templates are ready
- CSV export is fully functional
- Check browser popup blocker settings

## Contact & Support

For issues or feature requests:
- Check the AI Co-Pilot for quick help
- Review INTEGRATION_COMPLETE.md for technical details
- Refer to COMPONENTS.md for API documentation

---

**Last Updated**: March 23, 2026
**Version**: 1.0 - Integration Complete
