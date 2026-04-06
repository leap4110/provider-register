interface ServiceRequestSMSParams {
  to: string;
  categoryName: string;
  postcode: string;
  suburb: string;
  requestId: string;
}

export async function sendServiceRequestSMS(
  params: ServiceRequestSMSParams
): Promise<void> {
  const { to, categoryName, postcode, suburb } = params;

  const message = `New service request: ${categoryName} in ${suburb || postcode}. Log in to your dashboard to review and respond. ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/service-requests`;

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.log("📱 [SMS - NOT SENT - No Twilio credentials configured]");
    console.log(`   To: ${to}`);
    console.log(`   Message: ${message}`);
    return;
  }

  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`;

  const response = await fetch(twilioUrl, {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      From: process.env.TWILIO_PHONE_NUMBER || "",
      To: to,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Twilio API error: ${JSON.stringify(error)}`);
  }

  console.log(`📱 SMS sent to ${to}`);
}
