import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validations/contact';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // Store in database
    const submission = await prisma.contactSubmission.create({
      data: {
        name: validated.name,
        email: validated.email,
        subject: validated.subject,
        message: validated.message,
      },
    });

    // Send emails (configure SMTP/Resend in env vars)
    const emailServiceConfigured = !!process.env.EMAIL_FROM;

    if (emailServiceConfigured) {
      await sendAdminNotification(validated);
      await sendClientConfirmation(validated);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully!',
      id: submission.id,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Invalid form data' },
        { status: 400 },
      );
    }
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}

async function sendAdminNotification(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  // Uses native fetch to call email API (Resend, SendGrid, or custom SMTP)
  const emailApiUrl = process.env.EMAIL_API_URL;
  const emailApiKey = process.env.EMAIL_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || 'contactwithmoaaz@gmail.com';

  if (!emailApiUrl || !emailApiKey) return;

  try {
    await fetch(emailApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${emailApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: adminEmail,
        subject: `New Contact: ${data.subject || 'Portfolio Inquiry'} from ${data.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
          ${data.subject ? `<p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
        `,
      }),
    });
  } catch (e) {
    console.error('Failed to send admin notification:', e);
  }
}

async function sendClientConfirmation(data: {
  name: string;
  email: string;
}) {
  const emailApiUrl = process.env.EMAIL_API_URL;
  const emailApiKey = process.env.EMAIL_API_KEY;

  if (!emailApiUrl || !emailApiKey) return;

  try {
    await fetch(emailApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${emailApiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: data.email,
        subject: "Thanks for reaching out! - Moaaz Mustafa",
        html: `
          <h2>Thanks for getting in touch, ${escapeHtml(data.name)}!</h2>
          <p>I've received your message and will get back to you as soon as possible.</p>
          <p>In the meantime, feel free to check out my latest work at <a href="https://www.moaazmustafa.dev">moaazmustafa.dev</a>.</p>
          <br>
          <p>Best regards,</p>
          <p>Moaaz Mustafa</p>
        `,
      }),
    });
  } catch (e) {
    console.error('Failed to send client confirmation:', e);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
