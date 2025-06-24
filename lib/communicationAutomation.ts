import { openai } from './openai';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  category: 'onboarding' | 'health-check' | 'upsell' | 'retention' | 'follow-up';
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: 'health_score' | 'usage_drop' | 'inactivity' | 'contract_renewal' | 'support_ticket';
    condition: string;
    value: number | string;
  };
  action: {
    type: 'email' | 'sms' | 'task' | 'alert';
    templateId?: string;
    delay?: number; // hours
    priority: 'low' | 'medium' | 'high';
  };
  active: boolean;
}

export interface CommunicationSequence {
  id: string;
  name: string;
  trigger: string;
  steps: {
    delay: number; // hours
    type: 'email' | 'sms' | 'task';
    templateId: string;
    condition?: string;
  }[];
}

export class CommunicationAutomation {
  private static emailTemplates: EmailTemplate[] = [
    {
      id: 'welcome_onboarding',
      name: 'Welcome & Onboarding',
      subject: 'Welcome to {{company_name}}, {{client_name}}! 🎉',
      body: `Hi {{client_name}},

Welcome to {{company_name}}! We're thrilled to have {{client_company}} as part of our community.

To help you get started quickly, I've prepared a personalized onboarding plan:

🚀 **Your Next Steps:**
1. Complete your profile setup
2. Import your first dataset
3. Schedule a 1:1 success call with me

**Quick Start Resources:**
- [Getting Started Guide]({{onboarding_guide}})
- [Video Tutorials]({{tutorial_link}})
- [Community Forum]({{community_link}})

I'll be checking in with you over the next few days to ensure everything goes smoothly. Feel free to reply to this email with any questions!

Best regards,
Emma - Your Customer Success Manager
{{company_name}}`,
      variables: ['client_name', 'client_company', 'company_name', 'onboarding_guide', 'tutorial_link', 'community_link'],
      category: 'onboarding'
    },
    {
      id: 'health_check_declining',
      name: 'Health Check - Declining',
      subject: 'Let\'s get {{client_company}} back on track 📈',
      body: `Hi {{client_name}},

I noticed that {{client_company}}'s engagement has decreased recently, and I wanted to reach out to see how I can help.

**What I've observed:**
- Usage has dropped by {{usage_decline}}% this month
- Last login: {{last_activity}}
- Current health score: {{health_score}}/100

**How I can help:**
- Schedule a quick 15-minute call to identify any blockers
- Provide additional training resources
- Connect you with our technical team if needed

Would you prefer a call this week or next? I have availability on {{available_times}}.

Looking forward to helping {{client_company}} succeed!

Best,
Emma
{{company_name}}`,
      variables: ['client_name', 'client_company', 'usage_decline', 'last_activity', 'health_score', 'available_times', 'company_name'],
      category: 'health-check'
    },
    {
      id: 'upsell_opportunity',
      name: 'Upsell Opportunity',
      subject: 'Unlock more value for {{client_company}} 🚀',
      body: `Hi {{client_name}},

Great news! I've been analyzing {{client_company}}'s usage patterns, and you're getting amazing results with our platform.

**Your Success Metrics:**
- {{usage_percentage}}% of your plan limit used
- {{feature_adoption}} features actively used
- {{success_metric}} improvement in your KPIs

Based on your growth, I think you'd benefit from our {{recommended_plan}} plan, which includes:
- {{feature_1}}
- {{feature_2}}
- {{feature_3}}
- Priority support

Would you like to schedule a 20-minute call to discuss how these features could accelerate {{client_company}}'s growth?

Best regards,
Emma
{{company_name}}`,
      variables: ['client_name', 'client_company', 'usage_percentage', 'feature_adoption', 'success_metric', 'recommended_plan', 'feature_1', 'feature_2', 'feature_3', 'company_name'],
      category: 'upsell'
    },
    {
      id: 'renewal_reminder',
      name: 'Contract Renewal Reminder',
      subject: 'Your {{client_company}} renewal is coming up',
      body: `Hi {{client_name}},

I hope you're having a great {{current_month}}! I wanted to reach out because {{client_company}}'s contract is up for renewal on {{renewal_date}}.

**Your Success Story:**
Over the past year, {{client_company}} has achieved:
- {{success_metric_1}}
- {{success_metric_2}}
- {{success_metric_3}}

**What's New for Next Year:**
- {{new_feature_1}}
- {{new_feature_2}}
- Enhanced support options

I'd love to schedule a renewal discussion to:
1. Review your success and ROI
2. Discuss your goals for next year
3. Explore any additional features that could help

Are you available for a 30-minute call next week?

Best,
Emma
{{company_name}}`,
      variables: ['client_name', 'client_company', 'current_month', 'renewal_date', 'success_metric_1', 'success_metric_2', 'success_metric_3', 'new_feature_1', 'new_feature_2', 'company_name'],
      category: 'retention'
    }
  ];

  static getEmailTemplates(): EmailTemplate[] {
    return this.emailTemplates;
  }

  static getTemplate(id: string): EmailTemplate | undefined {
    return this.emailTemplates.find(template => template.id === id);
  }

  static async generatePersonalizedEmail(
    templateId: string,
    clientData: any,
    customContext?: string
  ): Promise<{ subject: string; body: string; variables: Record<string, string> }> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    try {
      const prompt = `
        Generate personalized email content using this template and client data:
        
        Template: ${template.name}
        Subject: ${template.subject}
        Body: ${template.body}
        
        Client Data:
        - Name: ${clientData.name}
        - Company: ${clientData.company}
        - Email: ${clientData.email}
        - Plan: ${clientData.plan}
        - Usage: ${clientData.usage.currentMonth}/${clientData.usage.limit}
        - Health Score: ${clientData.healthScore}
        - Last Activity: ${clientData.lastActivity}
        - Contract Value: $${clientData.contractValue}
        - Next Renewal: ${clientData.nextRenewal}
        
        ${customContext ? `Additional Context: ${customContext}` : ''}
        
        Replace all {{variables}} with appropriate values and personalize the content.
        Return JSON with: { subject, body, variables }
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        subject: result.subject || template.subject,
        body: result.body || template.body,
        variables: result.variables || {},
      };
    } catch (error) {
      console.error('Error generating personalized email:', error);
      return {
        subject: template.subject,
        body: template.body,
        variables: {},
      };
    }
  }

  static async generateSMSMessage(clientData: any, context: string): Promise<string> {
    try {
      const prompt = `
        Generate a professional but friendly SMS message for customer success.
        
        Context: ${context}
        Client: ${clientData.name} from ${clientData.company}
        
        Keep it under 160 characters, personalized, and include a clear call-to-action.
        Make it sound like it's from Emma, their Customer Success Manager.
      `;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 100,
      });

      return completion.choices[0].message.content || 'Hi! Emma here from your success team. Can we schedule a quick call to help optimize your account?';
    } catch (error) {
      console.error('Error generating SMS:', error);
      return 'Hi! Emma here from your success team. Can we schedule a quick call to help optimize your account?';
    }
  }

  static createAutomationRule(rule: Omit<AutomationRule, 'id'>): AutomationRule {
    return {
      id: `rule_${Date.now()}`,
      ...rule,
    };
  }

  static evaluateAutomationRules(clientData: any, rules: AutomationRule[]): AutomationRule[] {
    return rules.filter(rule => {
      if (!rule.active) return false;

      switch (rule.trigger.type) {
        case 'health_score':
          return this.evaluateHealthScoreTrigger(clientData, rule.trigger);
        case 'usage_drop':
          return this.evaluateUsageDropTrigger(clientData, rule.trigger);
        case 'inactivity':
          return this.evaluateInactivityTrigger(clientData, rule.trigger);
        case 'contract_renewal':
          return this.evaluateRenewalTrigger(clientData, rule.trigger);
        default:
          return false;
      }
    });
  }

  private static evaluateHealthScoreTrigger(clientData: any, trigger: any): boolean {
    const healthScore = clientData.healthScore || 0;
    switch (trigger.condition) {
      case 'below':
        return healthScore < trigger.value;
      case 'above':
        return healthScore > trigger.value;
      case 'equals':
        return healthScore === trigger.value;
      default:
        return false;
    }
  }

  private static evaluateUsageDropTrigger(clientData: any, trigger: any): boolean {
    const currentUsage = clientData.usage.currentMonth || 0;
    const lastUsage = clientData.usage.lastMonth || 0;
    const dropPercentage = lastUsage > 0 ? ((lastUsage - currentUsage) / lastUsage) * 100 : 0;
    
    return dropPercentage >= trigger.value;
  }

  private static evaluateInactivityTrigger(clientData: any, trigger: any): boolean {
    const lastActivity = new Date(clientData.lastActivity);
    const daysSinceActivity = Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceActivity >= trigger.value;
  }

  private static evaluateRenewalTrigger(clientData: any, trigger: any): boolean {
    if (!clientData.nextRenewal) return false;
    
    const renewalDate = new Date(clientData.nextRenewal);
    const daysUntilRenewal = Math.floor((renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilRenewal <= trigger.value;
  }

  static createCommunicationSequence(sequence: Omit<CommunicationSequence, 'id'>): CommunicationSequence {
    return {
      id: `sequence_${Date.now()}`,
      ...sequence,
    };
  }

  static getDefaultAutomationRules(): AutomationRule[] {
    return [
      {
        id: 'health_decline_alert',
        name: 'Health Score Decline Alert',
        trigger: {
          type: 'health_score',
          condition: 'below',
          value: 60,
        },
        action: {
          type: 'email',
          templateId: 'health_check_declining',
          delay: 2,
          priority: 'high',
        },
        active: true,
      },
      {
        id: 'inactivity_followup',
        name: 'Inactivity Follow-up',
        trigger: {
          type: 'inactivity',
          condition: 'above',
          value: 7,
        },
        action: {
          type: 'email',
          templateId: 'health_check_declining',
          delay: 24,
          priority: 'medium',
        },
        active: true,
      },
      {
        id: 'renewal_reminder',
        name: 'Contract Renewal Reminder',
        trigger: {
          type: 'contract_renewal',
          condition: 'within',
          value: 30,
        },
        action: {
          type: 'email',
          templateId: 'renewal_reminder',
          delay: 0,
          priority: 'high',
        },
        active: true,
      },
    ];
  }

  static async scheduleAutomatedCommunication(
    clientData: any,
    rule: AutomationRule
  ): Promise<{ scheduled: boolean; message: string }> {
    try {
      // In a real implementation, this would integrate with email service (SendGrid, etc.)
      // and SMS service (Twilio, etc.)
      
      console.log(`Scheduling ${rule.action.type} for ${clientData.name} in ${rule.action.delay} hours`);
      
      if (rule.action.type === 'email' && rule.action.templateId) {
        const emailContent = await this.generatePersonalizedEmail(
          rule.action.templateId,
          clientData
        );
        
        // Mock email scheduling
        console.log('Email scheduled:', {
          to: clientData.email,
          subject: emailContent.subject,
          priority: rule.action.priority,
        });
      }

      return {
        scheduled: true,
        message: `${rule.action.type} scheduled for ${clientData.name}`,
      };
    } catch (error) {
      console.error('Error scheduling communication:', error);
      return {
        scheduled: false,
        message: `Failed to schedule ${rule.action.type}`,
      };
    }
  }
}

export default CommunicationAutomation; 