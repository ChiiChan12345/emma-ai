import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      company,
      phone,
      inquiryType,
      subject,
      message,
      budget,
      timeline
    } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email content
    const inquiryTypeLabels: { [key: string]: string } = {
      'enterprise': '💼 Enterprise Sales',
      'feature': '💡 Feature Request',
      'feedback': '⭐ Feedback',
      'support': '🛠️ Technical Support',
      'partnership': '🤝 Partnership',
      'general': '💬 General Inquiry'
    };

    const emailSubject = `[Emma AI Contact] ${inquiryTypeLabels[inquiryType] || 'General Inquiry'}: ${subject}`;
    
    let emailBody = `
New contact form submission from Emma AI website:

📧 CONTACT DETAILS:
• Name: ${name}
• Email: ${email}
• Company: ${company || 'Not provided'}
• Phone: ${phone || 'Not provided'}

🎯 INQUIRY TYPE: ${inquiryTypeLabels[inquiryType] || 'General Inquiry'}

📝 SUBJECT: ${subject}

💬 MESSAGE:
${message}
`;

    // Add enterprise-specific details
    if (inquiryType === 'enterprise' && (budget || timeline)) {
      emailBody += `

💼 ENTERPRISE DETAILS:
• Budget Range: ${budget || 'Not specified'}
• Timeline: ${timeline || 'Not specified'}
`;
    }

    emailBody += `

---
This message was sent from the Emma AI contact form.
Reply directly to this email to respond to ${name}.
`;

    // For now, we'll use a simple mailto approach
    // In production, you'd want to use a service like SendGrid, Resend, or AWS SES
    
    // Create a mailto URL that opens the user's email client
    const mailtoUrl = `mailto:emmaaisaas@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Since we can't actually send emails server-side without additional setup,
    // we'll return success and log the details
    console.log('Contact form submission:', {
      name,
      email,
      company,
      phone,
      inquiryType,
      subject,
      message,
      budget,
      timeline,
      timestamp: new Date().toISOString()
    });

    // In a real implementation, you would:
    // 1. Use an email service like Resend, SendGrid, or AWS SES
    // 2. Send the email to emmaaisaas@gmail.com
    // 3. Optionally send a confirmation email to the user
    // 4. Store the submission in a database for tracking

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message received successfully',
        mailtoUrl // For fallback if needed
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
} 