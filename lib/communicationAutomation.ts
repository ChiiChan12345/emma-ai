import { openai } from './openai';
import { Client } from './types';

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
      subject: 'Welcome to {{company_name}}, {{client_name}}!',
      body: `
        Hi {{client_name}},

        Welcome to {{company_name}}! I'm Emma, your dedicated Customer Success Manager, and I'm thrilled to have you on board.

        I wanted to reach out personally to ensure you have everything you need to get started and maximize your success with our platform.

        Here's what I've prepared for you:
        
        🎯 Your personalized onboarding plan
        📊 Access to your dedicated dashboard
        🎓 Training resources tailored to your {{plan}} plan
        📞 Direct line to our support team

        I'll be checking in with you regularly to ensure you're getting the most value from our platform. If you have any questions or need assistance, please don't hesitate to reach out.

        Looking forward to your success!

        Best regards,
        Emma Thompson
        Customer Success Manager
        {{company_name}}
      `,
      variables: ['client_name', 'company_name', 'plan'],
      category: 'onboarding'
    },
    {
      id: 'health_check_declining',
      name: 'Health Check - Declining Score',
      subject: 'Let\'s get your {{company_name}} account back on track, {{client_name}}',
      body: `
        Hi {{client_name}},

        I hope you're doing well! I've been monitoring your {{company_name}} account and noticed that your engagement has decreased recently.

        I want to make sure you're getting the maximum value from our platform. Here's what I've observed:

        📊 Usage has dropped by {{usage_change}}% this month
        🎯 You're currently using {{current_usage}} of your {{usage_limit}} monthly limit
        ⚠️ Health score: {{health_score}}/100

        I'd love to schedule a quick 15-minute call to:
        ✅ Understand any challenges you might be facing
        ✅ Share some best practices that could help
        ✅ Discuss features that might be perfect for your workflow

        When would be a good time for you this week?

        Best regards,
        Emma Thompson
        Customer Success Manager
      `,
      variables: ['client_name', 'company_name', 'usage_change', 'current_usage', 'usage_limit', 'health_score'],
      category: 'health-check'
    },
    {
      id: 'upsell_opportunity',
      name: 'Upgrade Opportunity',
      subject: 'Ready to unlock more potential, {{client_name}}?',
      body: `
        Hi {{client_name}},

        Fantastic news! I've been analyzing your {{company_name}} usage patterns, and I can see you're really making the most of our platform.

        You're currently using {{usage_percentage}}% of your {{current_plan}} plan limits, which tells me you're getting great value from our service.

        I wanted to share an exciting opportunity: our {{recommended_plan}} plan could unlock even more potential for your team:

        🚀 {{feature_1}}
        📈 {{feature_2}}
        🎯 {{feature_3}}
        💰 Potential ROI increase of {{roi_increase}}%

        Based on your current usage, I estimate this upgrade could save you {{time_savings}} hours per month and increase your team's productivity significantly.

        Would you be interested in a brief demo to see these features in action?

        Best regards,
        Emma Thompson
        Customer Success Manager
      `,
      variables: ['client_name', 'company_name', 'usage_percentage', 'current_plan', 'recommended_plan', 'feature_1', 'feature_2', 'feature_3', 'roi_increase', 'time_savings'],
      category: 'upsell'
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
    clientData: Client,
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

  static async generateSMSMessage(clientData: Client, context: string): Promise<string> {
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

  static evaluateAutomationRules(clientData: Client, rules: AutomationRule[]): AutomationRule[] {
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

  private static evaluateHealthScoreTrigger(clientData: Client, trigger: AutomationRule['trigger']): boolean {
    const healthScore = clientData.healthScore || 0;
    switch (trigger.condition) {
      case 'below':
        return healthScore < Number(trigger.value);
      case 'above':
        return healthScore > Number(trigger.value);
      case 'equals':
        return healthScore === Number(trigger.value);
      default:
        return false;
    }
  }

  private static evaluateUsageDropTrigger(clientData: Client, trigger: AutomationRule['trigger']): boolean {
    const currentUsage = clientData.usage.currentMonth || 0;
    const lastUsage = clientData.usage.lastMonth || 0;
    const dropPercentage = lastUsage > 0 ? ((lastUsage - currentUsage) / lastUsage) * 100 : 0;
    
    return dropPercentage >= Number(trigger.value);
  }

  private static evaluateInactivityTrigger(clientData: Client, trigger: AutomationRule['trigger']): boolean {
    const lastActivity = new Date(clientData.lastActivity);
    const daysSinceActivity = Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysSinceActivity >= Number(trigger.value);
  }

  private static evaluateRenewalTrigger(clientData: Client, trigger: AutomationRule['trigger']): boolean {
    if (!clientData.nextRenewal) return false;
    
    const renewalDate = new Date(clientData.nextRenewal);
    const daysUntilRenewal = Math.floor((renewalDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilRenewal <= Number(trigger.value);
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
          templateId: 'upsell_opportunity',
          delay: 0,
          priority: 'high',
        },
        active: true,
      },
    ];
  }

  static async scheduleAutomatedCommunication(
    clientData: Client,
    rule: AutomationRule
  ): Promise<{ scheduled: boolean; message: string }> {
    try {
      // In a real implementation, this would integrate with a job queue or scheduler
      const delay = rule.action.delay || 0;
      const scheduledTime = new Date(Date.now() + delay * 60 * 60 * 1000);

      // Mock scheduling
      console.log(`Scheduled ${rule.action.type} for ${clientData.name} at ${scheduledTime.toISOString()}`);

      return {
        scheduled: true,
        message: `${rule.action.type} scheduled for ${scheduledTime.toLocaleString()}`,
      };
    } catch (error) {
      console.error('Error scheduling communication:', error);
      return {
        scheduled: false,
        message: `Failed to schedule communication: ${error}`,
      };
    }
  }
}

export default CommunicationAutomation; 