// Vercel Serverless Function for sending SMS via Twilio
const twilio = require('twilio');

export default async function handler(req, res) {
  // Only allow POST requests or cron requests
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret for scheduled requests
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    // Allow manual triggers without auth for testing
    if (req.method === 'GET' && !req.query.test) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const recipientPhone = process.env.RECIPIENT_PHONE_NUMBER;
  const siteUrl = process.env.SITE_URL || 'https://your-app.vercel.app';

  if (!accountSid || !authToken || !twilioPhone || !recipientPhone) {
    return res.status(500).json({
      error: 'Missing Twilio configuration',
      missing: {
        accountSid: !accountSid,
        authToken: !authToken,
        twilioPhone: !twilioPhone,
        recipientPhone: !recipientPhone
      }
    });
  }

  try {
    const client = twilio(accountSid, authToken);

    // Fixed start date: January 11, 2026 at 9:15 PM Nova Scotia time (AST = UTC-4)
    const startDate = new Date('2026-01-11T21:15:00-04:00');
    const now = new Date();
    const days = Math.max(1, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

    const funnyMessages = [
      `🚨 AMBER ALERT: Julie last seen ${days} days ago fleeing to Cape Breton. Considered armed with excuses: ${siteUrl}`,
      `📊 Julie's avoidance stats: ${days} days hiding, 0 visits planned, 1 Ashley still waiting: ${siteUrl}`,
      `🦞 The lobsters in Cape Breton called. They said visit Ashley already. ${days} days: ${siteUrl}`,
      `⚠️ WARNING: Julie has gone ${days} days without Ashley. Side effects may include fun withdrawal: ${siteUrl}`,
      `📍 GPS shows Julie still in Cape Breton after ${days} days. Suspicious. Very suspicious: ${siteUrl}`,
      `☎️ Hi Julie! This is your ${days}-day reminder that Ashley exists: ${siteUrl}`,
      `👀 Day ${days}: Ashley is still watching. Ashley is still waiting. Ashley knows: ${siteUrl}`,
      `🏃‍♀️ Julie's been running from Ashley for ${days} days. New personal record?: ${siteUrl}`,
    ];

    const message = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: recipientPhone
    });

    return res.status(200).json({
      success: true,
      messageId: result.sid,
      message: message
    });

  } catch (error) {
    console.error('Twilio error:', error);
    return res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message
    });
  }
}
