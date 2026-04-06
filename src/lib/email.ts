interface ServiceRequestEmailParams {
  to: string;
  providerName: string;
  categoryName: string;
  postcode: string;
  suburb: string;
  requestId: string;
}

export async function sendServiceRequestEmail(
  params: ServiceRequestEmailParams
): Promise<void> {
  const { to, providerName, categoryName, postcode, suburb, requestId } =
    params;

  const subject = `New Service Request: ${categoryName} in ${suburb || postcode}`;
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/service-requests`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563EB; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">New Service Request</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #E5E7EB; border-top: none;">
        <p>Hi ${providerName},</p>
        <p>A participant is looking for <strong>${categoryName}</strong> in <strong>${suburb} (${postcode})</strong>.</p>
        <p>Log in to your dashboard to review the request details and respond.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${dashboardUrl}" style="background: #2563EB; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Request</a>
        </div>
        <p style="color: #6B7280; font-size: 14px;">This request will expire in 7 days.</p>
      </div>
    </div>
  `;

  if (!process.env.RESEND_API_KEY) {
    console.log("📧 [EMAIL - NOT SENT - No API key configured]");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Request ID: ${requestId}`);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "notifications@yourdomain.com.au",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${JSON.stringify(error)}`);
  }

  console.log(`📧 Email sent to ${to}: ${subject}`);
}

interface RequestConfirmationEmailParams {
  to: string;
  participantName: string;
  categoryName: string;
  postcode: string;
  suburb: string;
  matchCount: number;
}

export async function sendRequestConfirmationEmail(
  params: RequestConfirmationEmailParams
): Promise<void> {
  const { to, participantName, categoryName, postcode, suburb, matchCount } =
    params;

  const subject = "Your service request has been submitted";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563EB; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Request Submitted</h1>
      </div>
      <div style="padding: 24px; border: 1px solid #E5E7EB; border-top: none;">
        <p>Hi ${participantName},</p>
        <p>Your service request for <strong>${categoryName}</strong> in <strong>${suburb} (${postcode})</strong> has been submitted successfully.</p>
        ${
          matchCount > 0
            ? `<p>We've notified <strong>${matchCount} provider${matchCount > 1 ? "s" : ""}</strong> who deliver this service in your area.</p>`
            : `<p>We couldn't find matching providers at this time. Check back later as new providers join.</p>`
        }
        <p>Track your request at <a href="${process.env.NEXT_PUBLIC_APP_URL}/my-requests" style="color: #2563EB;">My Requests</a>.</p>
      </div>
    </div>
  `;

  if (!process.env.RESEND_API_KEY) {
    console.log("📧 [PARTICIPANT CONFIRMATION - NOT SENT - No API key]");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || "notifications@yourdomain.com.au",
      to,
      subject,
      html,
    }),
  });

  console.log(`📧 Confirmation email sent to ${to}`);
}
