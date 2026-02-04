import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    // Check for API key
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Map subject codes to readable labels
    const subjectLabels: Record<string, string> = {
      question: 'Question about content',
      bug: 'Bug report',
      suggestion: 'Suggestion for improvement',
      other: 'Other'
    };

    const subjectLabel = subjectLabels[subject] || subject;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'CongDan.US Contact <noreply@congdan.us>',
      to: process.env.CONTACT_EMAIL || 'contact@congdan.us',
      replyTo: email,
      subject: `[${subjectLabel}] Contact form from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subjectLabel}</p>
        <hr />
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">
          Sent from CongDan.US contact form
        </p>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subjectLabel}

Message:
${message}

---
Sent from CongDan.US contact form
      `.trim()
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
