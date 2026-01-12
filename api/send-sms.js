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

    // Calculate days since start (yesterday at 9:15 PM Nova Scotia time)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(21, 15, 0, 0);
    const now = new Date();
    const days = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));

    const funnyMessages = [
      `⛴️ JULIE! ${days} days since you took the ferry! Marine Atlantic misses you: ${siteUrl}`,
      `📢 Weekly update: ${days} days hiding in Cape Breton! Newfoundland awaits: ${siteUrl}`,
      `🚢 Hey Julie! The ferry runs daily! ${days} days and counting: ${siteUrl}`,
      `🌊 Julie! The Cabot Strait isn't THAT wide! ${days} days of excuses: ${siteUrl}`,
      `🙈 ${days} days in Cape Breton! Ashley is tracking from The Rock: ${siteUrl}`,
      `😂 North Sydney has a ferry terminal, Julie! ${days} days: ${siteUrl}`,
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
