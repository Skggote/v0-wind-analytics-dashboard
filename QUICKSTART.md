# WindFlow Dashboard - Quick Start Guide

## Installation & Setup (2 minutes)

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Steps
```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Open browser
# Navigate to http://localhost:3000
```

## Dashboard Navigation

### Main Pages
| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | Main overview with all KPIs |
| Fleet | `/fleet` | Turbine management and monitoring |
| Maintenance | `/maintenance` | Predictive maintenance planning |
| Optimization | `/optimization` | Performance improvement analysis |
| Analytics | `/analytics` | Historical trends and reporting |
| AI Co-Pilot | `/copilot` | AI-powered insights and chat |

## Key Features Overview

### 1. Main Dashboard (/)
**What you see:**
- 16 KPI cards organized by category
- 4 interactive charts
- Anomaly list
- Global filters at the top

**Try this:**
1. Click on the date range filter (default: "Last 7 Days")
2. Select "Last 30 Days"
3. Watch the KPIs and charts update
4. Try filtering by farm or turbine status

### 2. Fleet Management (/fleet)
**What you see:**
- Farm selection cards
- Fleet status statistics
- Turbine grid layout
- Detailed fleet table

**Try this:**
1. Click a different farm to switch between them
2. Hover over turbines in the grid to see their status
3. Check the "Details" tab for the full turbine table
4. Review the "Timeline" for recent events

### 3. Predictive Maintenance (/maintenance)
**What you see:**
- Critical turbines requiring attention
- RUL (Remaining Useful Life) predictions
- Maintenance schedule
- Health degradation trends

**Try this:**
1. Review turbines marked as "Critical" (red)
2. Check the maintenance schedule to see planned work
3. Look at the degradation chart to understand health trends
4. Click "Schedule" on any turbine to plan maintenance

### 4. Performance Optimization (/optimization)
**What you see:**
- What-if scenarios for revenue impact
- Efficiency improvement opportunities
- AI recommendations with ROI

**Try this:**
1. Compare revenue across different scenarios
2. Review efficiency measures and their potential gains
3. Check the recommended actions (green, blue, yellow cards)
4. Click "Learn More" to see implementation details

### 5. Analytics & Reporting (/analytics)
**What you see:**
- Monthly trends
- 6-month performance summary
- Anomaly resolution tracking
- Export options

**Try this:**
1. Switch between tabs (Revenue, Efficiency, Maintenance, Anomalies)
2. Hover over charts to see detailed values
3. Review the key insights section
4. Click "Export Report" to download data

### 6. AI Co-Pilot (/copilot)
**What you see:**
- Chat interface
- Suggested questions
- Active anomalies
- Performance insights

**Try this:**
1. Click on a suggested question to ask the AI
2. Ask custom questions like "Why is Turbine 12 vibrating?"
3. Switch to "Insights & Reports" tab
4. Review recommendations and metrics

## Common Tasks

### Check Fleet Health
1. Go to Dashboard (/)
2. Look for "Fleet Health Score" card
3. Click to see detailed metrics
4. Go to Fleet (/fleet) for turbine-level details

### Plan Maintenance
1. Go to Maintenance (/maintenance)
2. Review RUL predictions
3. Check scheduled maintenance table
4. Click "Schedule" to plan additional work

### Find Underperforming Turbines
1. Go to Analytics (/analytics)
2. Check "Turbine Performance vs Health" scatter chart
3. Go to Fleet (/fleet) and filter by specific status
4. Click turbine to see detailed data

### Analyze Revenue
1. Go to Analytics (/analytics)
2. Select "Revenue" tab
3. Review monthly trends
4. Check vs Maintenance Costs chart
5. Go to Optimization (/optimization) for improvement suggestions

### Get AI Recommendations
1. Go to AI Co-Pilot (/copilot)
2. Ask about specific issues: "Which turbines need maintenance?"
3. Ask about optimization: "How can we reduce costs?"
4. Ask about performance: "What's affecting our capacity?"

## Understanding the KPIs

### Green Status = Good ✅
- Capacity Factor > 30%
- Availability > 98%
- Health Score > 80%
- Forecast Accuracy > 90%

### Yellow Status = Watch ⚠️
- Capacity Factor 20-30%
- Availability 95-98%
- Health Score 60-80%
- Maintenance Risk 20-40%

### Red Status = Critical ⛔
- Capacity Factor < 20%
- Availability < 95%
- Health Score < 60%
- RUL < 3 months

## Data Refresh

The dashboard uses mock data that simulates real wind farm operations:
- Data updates automatically
- Wind patterns are realistic (stronger at night)
- Anomalies appear randomly
- Forecast data is regenerated daily

## Customization

### Change Time Range
All pages support time range filters:
- Today
- Last 7 Days (default)
- Last 30 Days
- Last 90 Days
- Custom Range

### Filter by Farm
Available on all pages:
- North Ridge Wind Farm
- Coastal Breeze Farm
- Prairie Wind Complex
- Alpine Energy Farm

### Change Aggregation
Available on main dashboard:
- Hourly (detailed)
- Daily (summary)
- Weekly (trends)

## Tips & Tricks

### 1. Hover for Details
Most elements show tooltips on hover:
- KPI cards show additional information
- Chart points show exact values
- Status badges show meaning

### 2. Click for Drill-Down
Navigate through levels:
- Fleet → Specific Turbine
- Dashboard → Fleet → Details
- Analytics → Specific Metric

### 3. Use Filters Effectively
Combine filters:
- Farm + Date Range
- Turbine Status + Health Status
- All farms vs Specific farm

### 4. Compare Scenarios
Optimization page shows:
- Current performance
- With dispatch optimization
- With maintenance optimization
- With both + forecasting

### 5. Export Data
From Analytics page:
- Click "Export Report"
- Get CSV/JSON data
- Use for external analysis

## Troubleshooting

### Charts Not Showing
- Check if date range is selected
- Ensure filters are not too restrictive
- Try refreshing the page

### KPIs Look Wrong
- Verify you're on the right farm
- Check the date range is appropriate
- Ensure turbine filter isn't hiding all data

### AI Co-Pilot Not Responding
- Wait a moment for the response
- Try a simpler question
- Refresh the page

## Keyboard Shortcuts

- `/` - Focus search (when implemented)
- `?` - Show help (when implemented)
- `d` - Dashboard (when implemented)
- `f` - Fleet (when implemented)

## What's Next?

### Learning Paths
1. **Operator**: Dashboard → Fleet → Maintenance
2. **Manager**: Dashboard → Analytics → Optimization
3. **Engineer**: Maintenance → Optimization → Analytics
4. **Executive**: Analytics → Optimization → AI Co-Pilot

### Advanced Features (Coming Soon)
- Real-time SCADA data streaming
- Custom dashboard builder
- User roles and permissions
- API access
- Mobile app
- Email alerts
- Advanced ML predictions

## Getting Help

### Documentation
- See README.md for technical details
- See IMPLEMENTATION.md for architecture
- Check component comments for code help

### Common Questions

**Q: How often is data updated?**
A: Mock data simulates hourly updates. Real data would stream continuously.

**Q: Can I export reports?**
A: Yes, from the Analytics page. Download CSV or PDF.

**Q: How do RUL predictions work?**
A: Based on component health scores and degradation rates.

**Q: Can I integrate my own data?**
A: Yes, connect to a database by replacing mock data generator.

**Q: Is this mobile-friendly?**
A: Yes, fully responsive design. Try on your phone!

## Video Tours (Future)
- [2-min Dashboard Overview](future-link)
- [5-min Fleet Management](future-link)
- [3-min Maintenance Planning](future-link)
- [4-min Performance Optimization](future-link)

---

**Happy monitoring! 🌪️⚡**

For detailed information, see README.md and IMPLEMENTATION.md
