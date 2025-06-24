# Tutorial: Creating Custom Reports

Learn how to build powerful custom reports in Emma AI to track your customer success metrics and share insights with stakeholders.

## Prerequisites

- Emma AI account with reporting access
- Basic understanding of your key metrics
- Client data in the system (at least a few weeks of activity)

## Overview

This tutorial covers:
- Building your first custom report
- Selecting appropriate metrics and filters
- Designing effective visualizations
- Scheduling and sharing reports
- Best practices for report creation

## Step 1: Access the Custom Reports Section

1. **Navigate to Analytics**
   - Click "Analytics" in the left sidebar
   - You'll see three tabs at the top

2. **Switch to Custom Reports**
   - Click the "📈 Custom Reports" tab
   - This opens the custom reporting interface

3. **Explore the Interface**
   - Report builder on the left
   - Preview area in the center
   - Saved reports on the right

## Step 2: Choose Your Report Type

1. **Select Report Template**
   - **Executive Dashboard**: High-level business metrics
   - **Client Health Report**: Detailed health analysis
   - **Team Performance**: Individual and team metrics
   - **Custom Report**: Build from scratch

2. **For This Tutorial: Select "Custom Report"**
   - Click "Create Custom Report"
   - This gives you maximum flexibility

## Step 3: Configure Basic Settings

1. **Report Information**
   ```
   Report Name: Monthly Client Health Summary
   Description: Comprehensive overview of client health metrics for monthly review
   Category: Health Analysis
   ```

2. **Time Period**
   - Select "Last 30 Days" for monthly reports
   - Or choose "Custom Range" for specific periods
   - Consider your reporting frequency needs

3. **Report Format**
   - **Dashboard**: Interactive web view
   - **PDF**: Printable document
   - **Excel**: Data for further analysis
   - **Combination**: Multiple formats

## Step 4: Select Your Metrics

1. **Core Health Metrics**
   - Client Health Score Distribution
   - Health Score Trends (line chart)
   - At-Risk Client Count
   - Critical Client List

2. **Financial Metrics**
   - Average Revenue Per Account (ARPA)
   - Total Contract Value
   - Revenue at Risk
   - Expansion Opportunities

3. **Engagement Metrics**
   - Communication Response Rates
   - Meeting Attendance
   - Support Ticket Volume
   - Feature Usage Statistics

### Example Metric Selection:
```
Primary Metrics:
✓ Health Score Distribution (pie chart)
✓ Health Score Trends (line chart)
✓ ARPA by Segment (bar chart)
✓ At-Risk Clients (table)

Secondary Metrics:
✓ Communication Effectiveness
✓ Support Ticket Trends
✓ Renewal Pipeline
```

## Step 5: Apply Filters and Segments

1. **Client Filters**
   - **Status**: Active, Trial, Inactive
   - **Health**: Healthy, At-Risk, Critical
   - **Segment**: Enterprise, Mid-Market, SMB
   - **Industry**: Technology, Healthcare, Finance

2. **Time-Based Filters**
   - Date ranges for different metrics
   - Comparison periods (month-over-month)
   - Seasonal adjustments

3. **Team Filters**
   - Customer Success Manager
   - Account Executive
   - Support Representative
   - Geographic Region

### Example Filter Configuration:
```
Filters Applied:
- Status: Active and Trial clients only
- Date Range: Last 30 days
- Comparison: Previous 30 days
- Exclude: Internal test accounts
```

## Step 6: Design Your Visualizations

1. **Choose Chart Types**
   - **Pie Charts**: For distributions (health scores, segments)
   - **Line Charts**: For trends over time
   - **Bar Charts**: For comparisons between groups
   - **Tables**: For detailed client lists
   - **Scorecards**: For key numbers (KPIs)

2. **Customize Visual Elements**
   - Colors that match your brand
   - Clear, descriptive titles
   - Appropriate axis labels
   - Legend placement

3. **Layout Organization**
   - Most important metrics at the top
   - Logical flow from summary to detail
   - Consistent spacing and alignment
   - Mobile-friendly design

### Example Layout:
```
Row 1: Key KPIs (4 scorecards)
- Total Clients | Avg Health Score | ARPA | NPS

Row 2: Health Overview (2 charts)
- Health Distribution (pie) | Health Trends (line)

Row 3: Financial Metrics (2 charts)
- Revenue by Segment | Expansion Pipeline

Row 4: At-Risk Analysis (table + chart)
- Critical Clients List | Risk Factors
```

## Step 7: Configure Data Settings

1. **Data Refresh**
   - **Real-time**: Updates continuously
   - **Hourly**: Good for operational reports
   - **Daily**: Standard for most reports
   - **Manual**: For specific point-in-time analysis

2. **Data Sources**
   - Verify all required integrations are active
   - Check data quality and completeness
   - Handle missing or incomplete data

3. **Calculations**
   - Custom formulas for derived metrics
   - Aggregation methods (sum, average, median)
   - Percentage calculations
   - Growth rate calculations

## Step 8: Preview and Test

1. **Generate Preview**
   - Click "Preview Report" button
   - Review all visualizations
   - Check data accuracy
   - Verify formatting

2. **Test Different Scenarios**
   - Try different date ranges
   - Apply various filters
   - Check edge cases (no data, extreme values)
   - Verify calculations are correct

3. **Review with Stakeholders**
   - Share preview with key users
   - Gather feedback on metrics and layout
   - Make adjustments based on input
   - Confirm report meets requirements

## Step 9: Save and Configure Sharing

1. **Save Your Report**
   - Click "Save Report"
   - Choose a descriptive name
   - Add to appropriate category
   - Set access permissions

2. **Configure Automated Delivery**
   ```
   Schedule Settings:
   - Frequency: Monthly (1st of each month)
   - Time: 9:00 AM EST
   - Recipients: CEO, VP Customer Success, CSM Team
   - Format: PDF + Excel
   - Subject: Monthly Client Health Report - [Month Year]
   ```

3. **Set Up Alerts**
   - Threshold-based notifications
   - Significant changes in key metrics
   - Data quality issues
   - Report generation failures

## Step 10: Monitor and Optimize

1. **Track Report Usage**
   - Monitor who's viewing reports
   - Check engagement metrics
   - Gather user feedback
   - Identify improvement opportunities

2. **Regular Reviews**
   - Monthly report effectiveness review
   - Quarterly metric relevance check
   - Annual comprehensive overhaul
   - Continuous improvement process

## Advanced Features

### Dynamic Filtering
Create interactive reports where users can:
- Change date ranges on the fly
- Apply different client segments
- Drill down into specific metrics
- Compare different time periods

### Conditional Formatting
Highlight important information:
- Red for at-risk clients
- Green for healthy performance
- Yellow for warning indicators
- Custom rules for your business

### Calculated Fields
Create custom metrics:
```
Examples:
- Revenue per CSM = Total Revenue / Number of CSMs
- Client Satisfaction Trend = (Current NPS - Previous NPS) / Previous NPS
- Churn Risk Score = Weighted average of multiple risk factors
```

## Best Practices

### Report Design
1. **Keep It Simple**: Focus on key metrics that drive decisions
2. **Tell a Story**: Organize information in logical sequence
3. **Use Consistent Formatting**: Maintain visual consistency
4. **Optimize for Audience**: Tailor content to viewer needs

### Data Quality
1. **Validate Sources**: Ensure data accuracy and completeness
2. **Handle Missing Data**: Have strategies for incomplete information
3. **Regular Audits**: Check data quality periodically
4. **Document Assumptions**: Be clear about calculations and definitions

### Maintenance
1. **Regular Updates**: Keep reports current and relevant
2. **Performance Monitoring**: Ensure reports load quickly
3. **User Training**: Help stakeholders interpret data correctly
4. **Version Control**: Track changes and maintain history

## Common Mistakes to Avoid

1. **Too Many Metrics**: Overwhelming users with information
2. **Poor Visualization Choices**: Using wrong chart types
3. **Inconsistent Definitions**: Metrics meaning different things
4. **Outdated Information**: Not keeping reports current
5. **No Context**: Presenting data without explanation

## Troubleshooting

### Report Not Loading
- Check data source connections
- Verify user permissions
- Look for timeout issues
- Review system status

### Incorrect Data
- Validate calculation formulas
- Check filter configurations
- Verify data source accuracy
- Compare with source systems

### Formatting Issues
- Test on different devices/browsers
- Check responsive design settings
- Verify chart rendering
- Review PDF export quality

## Example: Complete Monthly Health Report

Here's a sample configuration for a comprehensive monthly report:

```
Report Name: Monthly Client Health Executive Summary

Metrics:
1. Executive KPIs (scorecards)
   - Total Active Clients: 247
   - Average Health Score: 78.5
   - Clients at Risk: 23 (9.3%)
   - Monthly Revenue: $1.2M

2. Health Distribution (pie chart)
   - Healthy: 198 clients (80%)
   - At-Risk: 37 clients (15%)
   - Critical: 12 clients (5%)

3. Health Trends (line chart)
   - 6-month health score progression
   - Comparison to industry benchmarks

4. Revenue Analysis (bar chart)
   - Revenue by client segment
   - Month-over-month growth

5. Action Items (table)
   - Critical clients requiring immediate attention
   - Expansion opportunities
   - Renewal risks

Delivery:
- PDF emailed monthly to executives
- Interactive dashboard for CSM team
- Excel export for detailed analysis
```

---

**Congratulations!** You've created a powerful custom report that will help drive data-driven customer success decisions.

*Next, explore our tutorial on "Setting Up Automated Workflows" to streamline your customer success processes.* 