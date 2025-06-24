'use client';

import React, { useState } from 'react';

interface DocumentSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  category: 'knowledge-base' | 'help-center' | 'tutorials';
}

interface HelpCenterProps {
  initialSection?: string;
}

const HelpCenter = ({ initialSection }: HelpCenterProps) => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const documentSections: DocumentSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Your first steps with Emma AI',
      icon: '📖',
      category: 'knowledge-base',
      content: `# Getting Started with Emma AI

Welcome to Emma AI, your intelligent Customer Success Manager platform designed for medium to large businesses, agencies, AI companies, and SaaS providers.

## What is Emma AI?

Emma AI is a comprehensive customer success management platform that helps you:

- **Manage Client Relationships**: Keep track of all your clients, their health scores, and engagement levels
- **Automate Communications**: Send personalized emails, SMS, and manage multi-channel outreach
- **Analyze Performance**: Get deep insights into client retention, revenue metrics, and growth opportunities
- **Integrate Everything**: Connect with 30+ popular tools including CRMs, communication platforms, and analytics tools
- **AI-Powered Insights**: Leverage artificial intelligence for predictive analytics and automated recommendations

## Quick Start Guide

### 1. Dashboard Overview
When you first log in, you'll see your main dashboard with:
- **Client Overview**: Total clients, active accounts, and health distribution
- **Recent Activity**: Latest client interactions and system updates
- **Quick Actions**: Add new clients, send communications, view reports

### 2. Managing Clients
- Navigate to the **Clients** section to view all your accounts
- Use filters to sort by status (Active, Trial, Inactive, Churned) or health (Healthy, At-Risk, Critical)
- Click on any client to view detailed information, communication history, and performance metrics

### 3. Communications Hub
- Access the **Communications** tab to manage all client outreach
- Create email campaigns, schedule SMS messages, or set up automated sequences
- Track open rates, response rates, and engagement metrics

### 4. Analytics & Reporting
- Visit the **Analytics** section for comprehensive business insights
- View key metrics like Average Revenue Per Account (ARPA), retention rates, and Net Promoter Score
- Create custom reports and export data in PDF, Excel, or CSV formats
- Set up automated reporting for executives and stakeholders

### 5. Integrations
- Go to **Integrations** to connect Emma AI with your existing tools
- Choose from CRMs (Salesforce, HubSpot, Zoho), communication tools (Slack, Teams), email marketing (Mailchimp, Klaviyo), and more
- Follow step-by-step setup guides for each integration

## Key Features

### Client Health Scoring
Emma AI automatically calculates health scores based on:
- Usage patterns and engagement levels
- Communication frequency and response rates
- Contract value and renewal probability
- Support ticket volume and resolution time

### Automated Workflows
Set up intelligent automation for:
- Welcome sequences for new clients
- At-risk client interventions
- Renewal reminders and upselling opportunities
- Regular check-ins and surveys

### Advanced Analytics
Get insights into:
- Client lifetime value and expansion opportunities
- Churn prediction and prevention strategies
- Team performance and productivity metrics
- Revenue forecasting and growth trends

## Best Practices

1. **Regular Health Score Reviews**: Check client health scores weekly and take action on at-risk accounts
2. **Consistent Communication**: Maintain regular touchpoints with all clients, not just the problematic ones
3. **Data-Driven Decisions**: Use analytics to guide your customer success strategy
4. **Integration Optimization**: Connect all your tools to get a complete view of client interactions
5. **Team Collaboration**: Share insights and coordinate efforts across sales, marketing, and support teams

## Next Steps

1. **Complete Your Profile**: Add your company information and team members
2. **Import Your Clients**: Upload your existing client database or connect your CRM
3. **Set Up Integrations**: Connect your most important tools first
4. **Create Your First Campaign**: Send a welcome message or check-in email
5. **Explore Analytics**: Review your baseline metrics and set improvement goals

*Ready to transform your customer success? Let's get started!*`
    },
    {
      id: 'client-management',
      title: 'Client Management',
      description: 'Complete guide to managing client relationships',
      icon: '👥',
      category: 'knowledge-base',
      content: `# Client Management Guide

Learn how to effectively manage your client relationships using Emma AI's powerful client management features.

## Client Overview

### Client Dashboard
The client dashboard provides a comprehensive view of all your accounts with:

- **Total Client Count**: See your complete client base at a glance
- **Status Distribution**: Active, Trial, Inactive, and Churned clients
- **Health Score Breakdown**: Healthy, At-Risk, and Critical accounts
- **Recent Activity**: Latest interactions and updates

### Client Health Scoring

Emma AI automatically calculates health scores (0-100) based on multiple factors:

**Healthy Clients (75-100)**
- High engagement and usage
- Regular communication
- On-time payments
- Low support ticket volume

**At-Risk Clients (50-74)**
- Declining usage patterns
- Reduced communication frequency
- Payment delays
- Increased support requests

**Critical Clients (0-49)**
- Very low or no usage
- No recent communication
- Payment issues
- High support ticket volume

## Managing Individual Clients

### Client Profiles
Each client profile contains:

**Basic Information**
- Company name and contact details
- Primary contact person
- Account status and plan type
- Contract start and renewal dates

**Engagement Metrics**
- Usage statistics and trends
- Communication history
- Health score evolution
- Key milestones and achievements

**Financial Data**
- Contract value and billing information
- Payment history
- Expansion opportunities
- Revenue contribution

### Adding New Clients

1. **Manual Entry**
   - Click "Add Client" button
   - Fill in required information
   - Set initial health score
   - Assign to team member

2. **Bulk Import**
   - Use CSV import feature
   - Map data fields correctly
   - Review and validate entries
   - Process import batch

3. **CRM Integration**
   - Connect your CRM system
   - Sync client data automatically
   - Set up real-time updates
   - Maintain data consistency

## Best Practices

### Daily Management
1. **Morning Health Check**: Review overnight health score changes
2. **Priority Follow-ups**: Contact at-risk and critical clients first
3. **Activity Logging**: Record all client interactions
4. **Task Management**: Update action items and next steps

### Weekly Reviews
1. **Segment Analysis**: Review each client category
2. **Trend Identification**: Spot patterns in client behavior
3. **Team Coordination**: Share insights with colleagues
4. **Strategy Adjustments**: Modify approaches based on data

*Effective client management is the foundation of successful customer success. Use these features to build stronger relationships and drive better outcomes.*`
    },
    {
      id: 'analytics-reporting',
      title: 'Analytics & Reporting',
      description: 'Master data-driven insights and custom reports',
      icon: '📊',
      category: 'knowledge-base',
      content: `# Analytics & Reporting Guide

Master Emma AI's powerful analytics and reporting capabilities to drive data-driven customer success decisions.

## Analytics Overview

Emma AI provides three main analytics sections:

### 📊 Analytics Overview
Your main dashboard for key customer success metrics and insights.

### 📈 Custom Reports
Create, schedule, and export personalized reports for stakeholders.

### 🧠 AI Insights
Leverage artificial intelligence for predictive analytics and recommendations.

## Key Metrics Explained

### Financial Metrics

**Average Revenue Per Account (ARPA)**
- Total revenue divided by number of accounts
- Tracks revenue efficiency and growth
- Industry benchmark: Varies by sector
- Goal: Increase through upselling and expansion

**Account Expansion Rate**
- Percentage of accounts that increased spending
- Measures growth from existing clients
- Formula: (Expansion Revenue / Total Revenue) × 100
- Target: 15-25% for healthy SaaS businesses

**Net Revenue Retention (NRR)**
- Revenue retained and expanded from existing customers
- Includes upgrades, downgrades, and churn
- Formula: (Starting Revenue + Expansion - Downgrades - Churn) / Starting Revenue
- Best-in-class: >110%

### Customer Health Metrics

**Client Retention Rate**
- Percentage of clients retained over a period
- Key indicator of customer satisfaction
- Formula: (Clients at End - New Clients) / Clients at Start × 100
- Industry average: 85-95%

**Net Promoter Score (NPS)**
- Customer loyalty and satisfaction metric
- Scale: -100 to +100
- Calculation: % Promoters - % Detractors
- Excellent: >70, Good: 50-70, Average: 0-50

**Health Score Distribution**
- Breakdown of clients by health categories
- Healthy: 75-100, At-Risk: 50-74, Critical: 0-49
- Ideal distribution: 70% Healthy, 25% At-Risk, 5% Critical

## Custom Reports

### Report Builder

**Metric Selection**
Choose from 50+ available metrics:
- Financial: Revenue, contracts, payments
- Engagement: Usage, communications, satisfaction
- Operational: Support, onboarding, renewals
- Predictive: Churn risk, expansion probability

**Filtering Options**
- Date ranges: Last 30 days, quarter, year, custom
- Client segments: By status, health, industry, size
- Team assignments: By CSM, region, product line
- Custom criteria: Tags, contract values, usage levels

### Pre-built Report Templates

**Executive Dashboard**
- High-level business metrics
- Revenue and growth trends
- Client health overview
- Key performance indicators

**Board Report**
- Monthly/quarterly summaries
- Year-over-year comparisons
- Strategic metrics and goals
- Risk and opportunity analysis

**Client Health Report**
- Detailed health score analysis
- At-risk client identification
- Intervention recommendations
- Success story highlights

### Export Options

**PDF Reports**
- Professional formatting
- Charts and visualizations
- Executive summaries
- Branded templates

**Excel Spreadsheets**
- Raw data for analysis
- Pivot tables and formulas
- Custom calculations
- Data manipulation

**CSV Files**
- Clean data export
- Integration with other tools
- Bulk data processing
- Database imports

*Transform your data into actionable insights that drive customer success and business growth.*`
    },
    {
      id: 'integrations',
      title: 'Integrations Guide',
      description: 'Connect your tools and workflows',
      icon: '🔗',
      category: 'knowledge-base',
      content: `# Integrations Guide

Connect Emma AI with your existing tools and workflows to create a unified customer success ecosystem.

## Integration Overview

Emma AI supports 30+ integrations across 10 categories:

- **CRM Systems**: Salesforce, HubSpot, Zoho, ClickUp
- **Communication**: Slack, Microsoft Teams, Discord, Zendesk
- **Email Marketing**: Mailchimp, Klaviyo
- **AI Platforms**: OpenAI, Anthropic, Google AI
- **Automation**: Zapier
- **Analytics**: Google Analytics, Power BI, Looker Studio
- **Project Management**: Notion, Asana, Trello, Monday, Airtable
- **Website**: Shopify, WooCommerce, WordPress
- **Scheduling**: Calendly, Loom
- **Security**: 1Password, Proton Pass

## CRM Integrations

### Salesforce Integration

**Benefits**
- Bidirectional data sync
- Real-time client updates
- Unified customer view
- Automated lead scoring

**Setup Process**
1. Log into Salesforce as administrator
2. Go to Setup > Apps > App Manager
3. Create new Connected App for Emma AI
4. Configure OAuth settings and permissions
5. Generate consumer key and secret
6. Enter credentials in Emma AI settings

**Data Synchronization**
- Accounts and contacts
- Opportunities and deals
- Activities and communications
- Custom fields and tags

### HubSpot Integration

**Benefits**
- Marketing automation sync
- Lead nurturing workflows
- Contact scoring integration
- Campaign performance tracking

**Setup Process**
1. Access HubSpot App Marketplace
2. Search for "Emma AI" integration
3. Install and authorize permissions
4. Configure field mappings
5. Set synchronization preferences
6. Test connection and data flow

## Communication Platform Integrations

### Slack Integration

**Features**
- Real-time client alerts
- Team collaboration channels
- Automated notifications
- Quick action commands

**Setup Process**
1. Go to Emma AI Integrations page
2. Click "Connect" on Slack integration
3. Authorize Emma AI app in Slack
4. Select channels for notifications
5. Configure alert preferences
6. Test notification delivery

**Available Commands**
- \`/emma client [name]\` - Get client information
- \`/emma health\` - View health score summary
- \`/emma alerts\` - Check recent alerts
- \`/emma report\` - Generate quick report

## Best Practices

### Integration Strategy

1. **Start with Core Systems**: Connect your most important tools first
2. **Plan Data Flow**: Map how information should move between systems
3. **Avoid Duplicates**: Ensure each integration serves a unique purpose
4. **Monitor Performance**: Track integration health and data quality
5. **Regular Maintenance**: Keep connections updated and secure

### Security Considerations

1. **API Key Management**: Store credentials securely
2. **Permission Scoping**: Grant minimum necessary access
3. **Regular Audits**: Review integration permissions periodically
4. **Access Logging**: Monitor integration usage and access
5. **Incident Response**: Have plans for security breaches

*Connect your entire customer success stack and create seamless workflows that drive better outcomes.*`
    },
    {
      id: 'first-client-tutorial',
      title: 'Setting Up Your First Client',
      description: 'Step-by-step tutorial for client onboarding',
      icon: '🎓',
      category: 'tutorials',
      content: `# Tutorial: Setting Up Your First Client

This step-by-step tutorial will guide you through adding and configuring your first client in Emma AI.

## Prerequisites

- Emma AI account with admin access
- Basic client information (company name, contact details, contract info)
- Optional: Existing CRM data for import

## Step 1: Access the Client Management Section

1. **Log into Emma AI**
   - Go to your Emma AI dashboard
   - Ensure you're on the main dashboard page

2. **Navigate to Clients**
   - Click on "Clients" in the left sidebar
   - You'll see the client management interface

3. **Review the Interface**
   - Client list (currently empty)
   - Filter options at the top
   - "Add Client" button in the top right

## Step 2: Add Your First Client

1. **Click "Add Client"**
   - Look for the blue "Add Client" button
   - Click to open the new client form

2. **Fill in Basic Information**
   \`\`\`
   Company Name: Acme Corporation
   Contact Person: John Smith
   Email: john.smith@acme.com
   Phone: +1 (555) 123-4567
   \`\`\`

3. **Set Client Status**
   - Choose from: Active, Trial, Inactive, Churned
   - For new clients, select "Active" or "Trial"

4. **Add Contract Details**
   \`\`\`
   Plan Type: Professional
   Contract Value: $50,000
   Start Date: Today's date
   Renewal Date: One year from start
   \`\`\`

5. **Set Initial Health Score**
   - New clients typically start at 75-80
   - This will be automatically updated based on activity

## Step 3: Configure Client Settings

1. **Assign Team Member**
   - Select the primary Customer Success Manager
   - This person will receive notifications about this client

2. **Add Tags and Categories**
   - Industry: Technology, Healthcare, Finance, etc.
   - Size: Small, Medium, Large, Enterprise
   - Priority: High, Medium, Low

3. **Set Communication Preferences**
   - Preferred communication method: Email, Phone, Slack
   - Frequency: Weekly, Bi-weekly, Monthly
   - Time zone: Client's local time zone

## Verification Checklist

Before considering your client setup complete, verify:

- [ ] All basic information is accurate
- [ ] Contact details are correct
- [ ] Contract information is complete
- [ ] Health score is set appropriately
- [ ] Team member is assigned
- [ ] Tags and categories are applied
- [ ] Communication preferences are configured
- [ ] Initial notes are documented
- [ ] Welcome communication is sent
- [ ] Monitoring alerts are active

## Next Steps

1. **Monitor Health Score**
   - Check health score weekly
   - Look for trends and patterns
   - Take action on significant changes

2. **Regular Communication**
   - Follow your communication schedule
   - Document all interactions
   - Track response rates and engagement

3. **Measure Success**
   - Monitor progress toward goals
   - Adjust strategies based on results
   - Celebrate achievements with the client

**Congratulations!** You've successfully set up your first client in Emma AI. This foundation will help you build strong customer relationships and drive success outcomes.`
    },
    {
      id: 'custom-reports-tutorial',
      title: 'Creating Custom Reports',
      description: 'Build powerful analytics dashboards',
      icon: '📈',
      category: 'tutorials',
      content: `# Tutorial: Creating Custom Reports

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
   \`\`\`
   Report Name: Monthly Client Health Summary
   Description: Comprehensive overview of client health metrics for monthly review
   Category: Health Analysis
   \`\`\`

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
\`\`\`
Primary Metrics:
✓ Health Score Distribution (pie chart)
✓ Health Score Trends (line chart)
✓ ARPA by Segment (bar chart)
✓ At-Risk Clients (table)

Secondary Metrics:
✓ Communication Effectiveness
✓ Support Ticket Trends
✓ Renewal Pipeline
\`\`\`

## Step 5: Design Your Visualizations

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
\`\`\`
Row 1: Key KPIs (4 scorecards)
- Total Clients | Avg Health Score | ARPA | NPS

Row 2: Health Overview (2 charts)
- Health Distribution (pie) | Health Trends (line)

Row 3: Financial Metrics (2 charts)
- Revenue by Segment | Expansion Pipeline

Row 4: At-Risk Analysis (table + chart)
- Critical Clients List | Risk Factors
\`\`\`

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

**Congratulations!** You've created a powerful custom report that will help drive data-driven customer success decisions.`
    },
    {
      id: 'communication-campaigns-tutorial',
      title: 'Creating Communication Campaigns',
      description: 'Design effective customer outreach campaigns',
      icon: '📧',
      category: 'tutorials',
      content: `# Tutorial: Creating Communication Campaigns

Learn how to design and execute effective customer communication campaigns using Emma AI's powerful automation and personalization features.

## Prerequisites

- Emma AI account with communication access
- Active client list with contact information
- Basic understanding of your customer segments
- Communication goals and success metrics defined

## Overview

This tutorial covers:
- Planning your communication strategy
- Creating email and SMS campaigns
- Setting up automation workflows
- Personalizing messages at scale
- Measuring campaign effectiveness

## Step 1: Plan Your Communication Strategy

1. **Define Campaign Objectives**
   - Welcome new clients
   - Re-engage inactive users
   - Promote feature adoption
   - Gather feedback and testimonials
   - Prevent churn and retain clients

2. **Identify Target Segments**
   - New clients (first 30 days)
   - At-risk clients (health score < 60)
   - High-value clients (top 20% revenue)
   - Feature non-adopters
   - Renewal candidates

3. **Choose Communication Channels**
   - Email: Detailed information and resources
   - SMS: Urgent alerts and quick updates
   - In-app: Contextual tips and guidance
   - Phone: Personal touch for high-value clients

## Step 2: Access the Communications Hub

1. **Navigate to Communications**
   - Click "Communications" in the left sidebar
   - You'll see the main communications dashboard

2. **Explore Available Options**
   - Email Campaigns
   - SMS Campaigns
   - Automated Workflows
   - Communication Templates
   - Campaign Analytics

3. **Review Recent Activity**
   - Recent sends and responses
   - Performance metrics
   - Scheduled campaigns

## Step 3: Create Your First Email Campaign

1. **Start New Campaign**
   - Click "Create Campaign" button
   - Select "Email Campaign"
   - Choose your campaign type

2. **Campaign Setup**
   \`\`\`
   Campaign Name: Welcome Series - New Clients
   Description: Onboard new clients with helpful resources
   Segment: Clients added in last 7 days
   Schedule: Send immediately after client signup
   \`\`\`

3. **Design Your Email**
   - Use pre-built templates or start from scratch
   - Add compelling subject line
   - Include personalization tokens
   - Add clear call-to-action buttons

### Example Welcome Email:
\`\`\`
Subject: Welcome to [Company Name], {{first_name}}! 🎉

Hi {{first_name}},

Welcome to Emma AI! We're thrilled to have {{company_name}} as part of our customer success family.

To help you get started, here are your next steps:

1. Complete your profile setup
2. Import your client data
3. Schedule your onboarding call

[Complete Setup] [Schedule Call] [View Resources]

Best regards,
Your Customer Success Team
\`\`\`

## Step 4: Set Up Automation Workflows

1. **Create Workflow Trigger**
   - Client status change
   - Health score threshold
   - Time-based triggers
   - Behavioral triggers

2. **Design Workflow Steps**
   - Email sequences
   - Wait periods
   - Conditional logic
   - Task assignments

3. **Example At-Risk Client Workflow**
   \`\`\`
   Trigger: Health score drops below 60
   
   Day 1: Send concern email to client
   Day 3: Create task for CSM to call
   Day 7: Send resource email with help articles
   Day 14: Escalate to management if no improvement
   \`\`\`

## Step 5: Personalize Your Messages

1. **Use Dynamic Content**
   - Client name and company
   - Usage statistics
   - Health score data
   - Recent activity

2. **Segment-Specific Messaging**
   - Industry-specific examples
   - Role-based content
   - Company size considerations
   - Geographic relevance

3. **Behavioral Personalization**
   - Feature usage patterns
   - Engagement history
   - Communication preferences
   - Success milestones

## Best Practices

### Message Design
1. **Clear Subject Lines**: Be specific and compelling
2. **Mobile Optimization**: Ensure emails look good on all devices
3. **Single Call-to-Action**: Focus on one primary action
4. **Value-First Approach**: Lead with benefits for the client

### Timing and Frequency
1. **Respect Time Zones**: Send during business hours
2. **Optimal Send Times**: Test different times for your audience
3. **Frequency Limits**: Don't overwhelm with too many messages
4. **Preference Centers**: Let clients control communication frequency

### Compliance and Ethics
1. **Permission-Based**: Only send to opted-in contacts
2. **Easy Unsubscribe**: Make it simple to opt out
3. **Data Privacy**: Respect client data and privacy
4. **Honest Communication**: Be transparent and authentic

**Congratulations!** You've created your first communication campaign that will help build stronger client relationships and drive better outcomes.`
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      description: 'Common questions and answers',
      icon: '❓',
      category: 'help-center',
      content: `# Frequently Asked Questions (FAQ)

Find quick answers to the most common questions about Emma AI.

## Getting Started

### Q: What is Emma AI?
**A:** Emma AI is a comprehensive Customer Success Manager platform designed for medium to large businesses, agencies, AI companies, and SaaS providers. It helps you manage client relationships, automate communications, analyze performance, and integrate with your existing tools to drive better customer outcomes.

### Q: Who should use Emma AI?
**A:** Emma AI is perfect for:
- Customer Success Managers and teams
- Account Managers and relationship builders
- SaaS companies wanting to reduce churn
- Agencies managing multiple client relationships
- AI companies needing customer intelligence
- Any business focused on customer retention and growth

### Q: How do I get started with Emma AI?
**A:** 
1. Sign up for an account at emma-ai.com
2. Complete the onboarding process
3. Import your existing client data
4. Set up key integrations (CRM, communication tools)
5. Create your first client profile
6. Explore the dashboard and features

### Q: Is there a free trial available?
**A:** Yes! We offer a 14-day free trial with full access to all features. No credit card required to start.

## Account and Billing

### Q: What pricing plans are available?
**A:** We offer several plans to fit different business sizes:
- **Starter**: $49/month - Up to 100 clients, basic features
- **Professional**: $99/month - Up to 500 clients, advanced analytics
- **Enterprise**: $199/month - Unlimited clients, custom integrations
- **Custom**: Contact us for large organizations with specific needs

### Q: Can I change my plan anytime?
**A:** Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.

## Client Management

### Q: How many clients can I manage?
**A:** This depends on your plan:
- Starter: Up to 100 clients
- Professional: Up to 500 clients  
- Enterprise: Unlimited clients
- Custom: Tailored to your needs

### Q: How is client health score calculated?
**A:** Health scores (0-100) are calculated using multiple factors:
- Usage patterns and engagement levels (40%)
- Communication frequency and response rates (25%)
- Contract value and payment history (20%)
- Support ticket volume and resolution time (15%)

### Q: Can I customize health score calculations?
**A:** Yes, Enterprise plans allow you to customize health score weighting and add custom factors specific to your business.

## Communications

### Q: What communication channels does Emma AI support?
**A:** Emma AI supports:
- Email campaigns and automation
- SMS messaging
- In-app notifications
- Slack and Teams integration
- Phone call logging
- Meeting scheduling and notes

### Q: Can I create email templates?
**A:** Yes, you can create and save unlimited email templates with:
- Personalization variables
- Rich text formatting
- Embedded images and links
- A/B testing capabilities

## Analytics and Reporting

### Q: What metrics does Emma AI track?
**A:** Emma AI tracks 50+ metrics including:
- Financial: ARPA, NRR, contract values
- Health: Client health scores, churn risk
- Engagement: Communication rates, meeting attendance
- Operational: Support tickets, response times
- Predictive: Expansion opportunities, renewal probability

### Q: Can I create custom reports?
**A:** Yes, the custom report builder allows you to:
- Select from 50+ available metrics
- Apply filters and segments
- Choose visualization types
- Schedule automated delivery
- Export in multiple formats (PDF, Excel, CSV)

## Integrations

### Q: What integrations are available?
**A:** Emma AI integrates with 30+ popular tools across 10 categories:
- CRM: Salesforce, HubSpot, Zoho, ClickUp
- Communication: Slack, Teams, Discord, Zendesk
- Email: Mailchimp, Klaviyo
- AI: OpenAI, Anthropic, Google AI
- Automation: Zapier
- Analytics: Google Analytics, Power BI
- Project Management: Notion, Asana, Trello
- And many more!

### Q: How difficult is it to set up integrations?
**A:** Most integrations can be set up in 5-10 minutes with our step-by-step guides. Each integration includes:
- Detailed setup instructions
- Required permissions and credentials
- Field mapping assistance
- Test procedures

## Security and Privacy

### Q: How secure is my data?
**A:** Emma AI uses enterprise-grade security:
- 256-bit SSL encryption for data in transit
- AES-256 encryption for data at rest
- SOC 2 Type II compliance
- Regular security audits and penetration testing
- GDPR and CCPA compliance

### Q: Where is my data stored?
**A:** Data is stored in secure, redundant data centers in the United States with automatic backups and disaster recovery procedures.

## Technical Support

### Q: What support options are available?
**A:** We offer multiple support channels:
- **Live Chat**: Available 24/7 in the application
- **Email Support**: Response within 24 hours
- **Knowledge Base**: Comprehensive self-service resources
- **Video Tutorials**: Step-by-step visual guides
- **Community Forum**: User discussions and tips

### Q: Do you offer onboarding assistance?
**A:** Yes:
- Starter/Professional: Self-service onboarding with email support
- Enterprise: Dedicated onboarding specialist
- Custom: White-glove setup and training services

**Contact Information:**
- Support Email: support@emma-ai.com
- Sales Email: sales@emma-ai.com
- Phone: 1-800-EMMA-AI (1-800-366-2241)
- Live Chat: Available in the app 24/7

*We're here to help you succeed with Emma AI. Don't hesitate to reach out!*`
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Guide',
      description: 'Resolve common issues quickly',
      icon: '🔧',
      category: 'help-center',
      content: `# Troubleshooting Guide

Resolve common issues quickly with this comprehensive troubleshooting guide for Emma AI.

## General Issues

### Login Problems

**Issue: Can't log into Emma AI**

**Possible Causes & Solutions:**

1. **Incorrect Credentials**
   - Verify email address and password
   - Check for typos and caps lock
   - Try password reset if unsure

2. **Account Suspended**
   - Check email for suspension notices
   - Contact billing if payment issues
   - Reach out to support for assistance

3. **Browser Issues**
   - Clear browser cache and cookies
   - Try incognito/private browsing mode
   - Update to latest browser version
   - Try a different browser

4. **Network Connectivity**
   - Check internet connection
   - Try accessing other websites
   - Contact IT if on corporate network
   - Disable VPN temporarily

**Quick Fix:**
\`\`\`
1. Go to emma-ai.com/login
2. Click "Forgot Password"
3. Enter your email address
4. Check email for reset link
5. Create new password
\`\`\`

### Dashboard Not Loading

**Issue: Dashboard appears blank or won't load**

**Troubleshooting Steps:**

1. **Browser Compatibility**
   - Use supported browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
   - Disable browser extensions temporarily
   - Clear browser cache (Ctrl+Shift+Delete)

2. **JavaScript Issues**
   - Ensure JavaScript is enabled
   - Check browser console for errors (F12)
   - Whitelist emma-ai.com in ad blockers

3. **Data Loading Problems**
   - Refresh the page (F5 or Ctrl+R)
   - Check network connection stability
   - Wait for large datasets to load completely

4. **Account Permissions**
   - Verify user has dashboard access
   - Contact admin to check permissions
   - Ensure account is active and paid

## Client Management Issues

### Clients Not Appearing

**Issue: Expected clients don't show in client list**

**Troubleshooting Checklist:**

1. **Filter Settings**
   - [ ] Clear all active filters
   - [ ] Check status filters (Active, Trial, etc.)
   - [ ] Verify health score filters
   - [ ] Reset date range filters

2. **Search Function**
   - [ ] Clear search box
   - [ ] Try partial name searches
   - [ ] Search by email or company
   - [ ] Check for typos in search terms

3. **Data Synchronization**
   - [ ] Check integration status
   - [ ] Force manual sync if available
   - [ ] Verify CRM connection
   - [ ] Review import logs for errors

4. **Permissions**
   - [ ] Confirm user has client access
   - [ ] Check team assignments
   - [ ] Verify territory restrictions
   - [ ] Contact admin for permission review

### Health Scores Incorrect

**Issue: Client health scores don't seem accurate**

**Diagnostic Steps:**

1. **Data Completeness**
   - Verify all client information is complete
   - Check for missing usage data
   - Confirm communication logs are syncing
   - Review contract and billing information

2. **Scoring Configuration**
   - Review health score criteria settings
   - Check weighting factors
   - Verify calculation periods
   - Compare with manual calculations

3. **Integration Issues**
   - Test all connected data sources
   - Check for API rate limiting
   - Verify field mappings are correct
   - Review sync timestamps

4. **Data Quality**
   - Look for duplicate entries
   - Check for outliers or anomalies
   - Verify data formats are correct
   - Clean up inconsistent data

**Manual Recalculation:**
\`\`\`
1. Go to Client Profile
2. Click "Settings" tab
3. Select "Recalculate Health Score"
4. Review updated score
5. Document any significant changes
\`\`\`

## Communication Issues

### Emails Not Sending

**Issue: Email campaigns or messages aren't being delivered**

**Troubleshooting Steps:**

1. **Email Configuration**
   - Verify email integration setup
   - Check SMTP settings if using custom
   - Test with simple text email first
   - Review authentication credentials

2. **Content Issues**
   - Check for spam trigger words
   - Verify all links are working
   - Ensure images are properly hosted
   - Review email size (keep under 100KB)

3. **Recipient Problems**
   - Verify email addresses are valid
   - Check for bounced email reports
   - Remove invalid addresses from lists
   - Confirm recipients haven't unsubscribed

4. **Sending Limits**
   - Check daily/hourly sending limits
   - Review plan restrictions
   - Monitor for rate limiting
   - Spread sends over longer periods

## Analytics and Reporting Issues

### Reports Not Generating

**Issue: Custom reports fail to generate or load**

**Troubleshooting:**

1. **Data Availability**
   - Verify sufficient data exists for date range
   - Check if all required integrations are active
   - Ensure metrics have data sources
   - Review data quality and completeness

2. **Report Configuration**
   - Simplify complex reports
   - Reduce number of metrics
   - Shorten date ranges
   - Remove problematic filters

3. **System Resources**
   - Try generating during off-peak hours
   - Reduce report complexity
   - Generate smaller date ranges
   - Contact support for large reports

4. **Browser Issues**
   - Clear browser cache
   - Disable browser extensions
   - Try different browser
   - Check JavaScript console for errors

## Getting Additional Help

### When to Contact Support

Contact Emma AI support if:
- Issues persist after following troubleshooting steps
- You encounter error messages not covered here
- Data integrity concerns arise
- Integration problems affect business operations
- Performance issues impact daily work

### Information to Provide

When contacting support, include:
- Detailed description of the issue
- Steps you've already tried
- Error messages or screenshots
- Browser and operating system details
- Time when issue first occurred
- Impact on your work or business

### Support Channels

1. **Live Chat**
   - Available 24/7 in the application
   - Best for urgent issues
   - Immediate response during business hours

2. **Email Support**
   - support@emma-ai.com
   - Include detailed information
   - Response within 24 hours

3. **Community Forum**
   - User discussions and solutions
   - Search existing topics first
   - Share experiences with other users

*Most issues can be resolved quickly with these troubleshooting steps. When in doubt, don't hesitate to contact our support team for assistance.*`
    },
    {
      id: 'system-requirements',
      title: 'System Requirements',
      description: 'Technical requirements and compatibility',
      icon: '💻',
      category: 'help-center',
      content: `# System Requirements

Ensure optimal performance with Emma AI by meeting these technical requirements and compatibility guidelines.

## Supported Browsers

### Recommended Browsers
- **Google Chrome 90+** (Recommended)
- **Mozilla Firefox 88+**
- **Safari 14+** (macOS/iOS)
- **Microsoft Edge 90+**

### Browser Features Required
- JavaScript enabled
- Cookies enabled
- Local storage support
- WebSocket support
- CSS3 and HTML5 support

### Browser Settings
- Pop-up blocker: Allow pop-ups from emma-ai.com
- Ad blockers: Whitelist emma-ai.com
- Privacy settings: Allow third-party cookies for integrations
- Security: Enable HTTPS/SSL

## Operating System Compatibility

### Desktop Operating Systems
- **Windows 10** or later
- **macOS 10.15 (Catalina)** or later
- **Ubuntu 18.04 LTS** or later
- **Chrome OS 88** or later

### Mobile Operating Systems
- **iOS 14** or later
- **Android 8.0 (API level 26)** or later

## Hardware Requirements

### Minimum Requirements
- **RAM**: 4 GB
- **Storage**: 1 GB available space
- **Processor**: Dual-core 2.0 GHz
- **Network**: Broadband internet connection (5 Mbps)
- **Display**: 1024x768 resolution

### Recommended Requirements
- **RAM**: 8 GB or more
- **Storage**: 2 GB available space
- **Processor**: Quad-core 2.5 GHz or better
- **Network**: High-speed internet (25 Mbps or faster)
- **Display**: 1920x1080 resolution or higher

## Network Requirements

### Internet Connection
- **Minimum Speed**: 5 Mbps download, 1 Mbps upload
- **Recommended Speed**: 25 Mbps download, 5 Mbps upload
- **Latency**: Less than 100ms to Emma AI servers
- **Connection Type**: Broadband (cable, fiber, DSL)

### Firewall and Security
- **HTTPS Traffic**: Allow outbound connections on port 443
- **WebSocket Connections**: Allow WSS protocol
- **Domain Whitelist**: Add *.emma-ai.com to allowed domains
- **API Endpoints**: Allow connections to api.emma-ai.com

### Corporate Networks
- **Proxy Support**: Configure proxy settings if required
- **VPN Compatibility**: Ensure VPN doesn't block WebSocket connections
- **Content Filtering**: Whitelist business/productivity applications
- **Bandwidth**: Ensure sufficient bandwidth for real-time features

## Integration Requirements

### CRM Integrations
- **Salesforce**: API access, OAuth 2.0 support
- **HubSpot**: Marketing Hub Professional or higher
- **Zoho**: CRM Professional edition or higher
- **ClickUp**: Business plan or higher

### Communication Platforms
- **Slack**: Workspace admin permissions
- **Microsoft Teams**: Office 365 Business or higher
- **Discord**: Server admin permissions
- **Zendesk**: Professional plan or higher

### Email Marketing
- **Mailchimp**: Standard plan or higher
- **Klaviyo**: Email plan or higher
- **SendGrid**: Pro plan or higher

## Data Storage and Backup

### Data Centers
- **Primary**: US East (Virginia)
- **Secondary**: US West (California)
- **Backup**: EU West (Ireland)
- **Compliance**: SOC 2 Type II, GDPR, CCPA

### Backup Schedule
- **Real-time**: Continuous data replication
- **Daily**: Full database backup
- **Weekly**: Complete system backup
- **Monthly**: Archive and long-term storage

### Data Retention
- **Active Data**: Unlimited retention
- **Deleted Data**: 30-day recovery period
- **Archived Data**: 7-year retention
- **Audit Logs**: 2-year retention

## Performance Optimization

### Browser Optimization
- Keep browser updated to latest version
- Clear cache and cookies regularly
- Disable unnecessary browser extensions
- Use private/incognito mode for testing

### Network Optimization
- Use wired connection when possible
- Close bandwidth-intensive applications
- Update router firmware regularly
- Consider upgrading internet plan for teams

### System Optimization
- Keep operating system updated
- Ensure adequate free disk space
- Close unnecessary applications
- Restart browser/system periodically

## Troubleshooting Performance Issues

### Slow Loading Times
1. Check internet connection speed
2. Clear browser cache and cookies
3. Disable browser extensions
4. Try different browser
5. Contact support if issues persist

### Connection Problems
1. Verify network connectivity
2. Check firewall settings
3. Test with different network
4. Disable VPN temporarily
5. Contact IT administrator

### Mobile Issues
1. Update mobile app to latest version
2. Restart mobile device
3. Check mobile data/WiFi connection
4. Clear app cache and data
5. Reinstall app if necessary

## Security Considerations

### Data Encryption
- **In Transit**: TLS 1.3 encryption
- **At Rest**: AES-256 encryption
- **API**: OAuth 2.0 and API keys
- **Passwords**: Bcrypt hashing

### Access Controls
- **Two-Factor Authentication**: Strongly recommended
- **Single Sign-On**: Available for Enterprise plans
- **Role-Based Access**: Granular permission controls
- **Session Management**: Automatic timeout and renewal

### Compliance Standards
- **SOC 2 Type II**: Annual audits and certification
- **GDPR**: European data protection compliance
- **CCPA**: California privacy law compliance
- **HIPAA**: Available for healthcare customers

**Contact Support:**
If you have questions about system requirements or need help with setup, contact our technical support team at support@emma-ai.com or use the live chat feature in the application.

*Ensuring your system meets these requirements will provide the best Emma AI experience with optimal performance and security.*`
    }
  ];

  // Filter documents based on initialSection prop
  const getFilteredDocs = () => {
    // Always show all documents in knowledge base now
    return documentSections;
  };

  const actualFilteredDocs = getFilteredDocs().filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get section title based on initialSection
  const getSectionTitle = () => {
    return 'Emma AI Help Center';
  };

  const getSectionDescription = () => {
    return 'Find guides, tutorials, and answers to help you get the most out of Emma AI.';
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let currentList: string[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.trim() === '```') {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={`code-${index}`} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm">{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        currentList.push(line.trim().substring(2));
        return;
      } else if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc list-inside mb-4 space-y-1">
            {currentList.map((item, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-300">{item}</li>
            ))}
          </ul>
        );
        currentList = [];
      }

      // Handle headings
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={index} className="font-semibold text-gray-900 dark:text-white mb-2">
            {line.substring(2, line.length - 2)}
          </p>
        );
      } else if (line.trim() === '') {
        // Empty line
        elements.push(<div key={index} className="mb-2"></div>);
      } else if (line.trim() !== '') {
        // Regular paragraph
        elements.push(
          <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    // Handle any remaining list items
    if (currentList.length > 0) {
      elements.push(
        <ul key="final-list" className="list-disc list-inside mb-4 space-y-1">
          {currentList.map((item, i) => (
            <li key={i} className="text-gray-700 dark:text-gray-300">{item}</li>
          ))}
        </ul>
      );
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedDoc ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {getSectionTitle()}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {getSectionDescription()}
              </p>
            </div>

            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Documentation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actualFilteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                      <span className="text-2xl">{doc.icon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {doc.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {doc.description}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    <span>Read more</span>
                    <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {actualFilteredDocs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No documentation found matching your search.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedDoc(null)}
                className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border border-blue-500/20"
              >
                <div className="bg-white/20 rounded-lg p-1 mr-3 group-hover:bg-white/30 transition-colors duration-200">
                  <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span>Back to Help Center</span>
              </button>
            </div>

            {/* Document Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {renderContent(documentSections.find(doc => doc.id === selectedDoc)?.content || '')}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HelpCenter; 