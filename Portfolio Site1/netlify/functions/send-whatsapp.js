'use strict'

const twilio = require('twilio');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, email, subject, message, hp } = payload;

  // Honeypot: bots will fill this — legitimate users won't
  if (hp && hp.trim() !== '') {
    console.warn('Honeypot triggered, rejecting submission');
    return { statusCode: 200, body: 'OK' }; // respond 200 to avoid leaking anti-bot
  }

  if (!name || !email || !message) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. whatsapp:+14155238886
  const to = process.env.TARGET_WHATSAPP_NUMBER; // e.g. whatsapp:+2349022086672

  if (!accountSid || !authToken || !from || !to) {
    console.error('Twilio env vars not set');
    return { statusCode: 500, body: 'Server not configured' };
  }

  // Simple in-memory per-IP rate limiter (not persistent across function cold starts)
  // Limits to 5 messages per hour per IP
  const ip = (event.headers && (event.headers['x-nf-client-connection-ip'] || event.headers['x-forwarded-for'] || event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp)) || 'unknown';
  const now = Date.now();
  if (!global._rateLimitMap) global._rateLimitMap = new Map();
  const entry = global._rateLimitMap.get(ip) || { count: 0, windowStart: now };
  const HOUR = 60 * 60 * 1000;
  if (now - entry.windowStart > HOUR) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count += 1;
  global._rateLimitMap.set(ip, entry);
  if (entry.count > 5) {
    console.warn(`Rate limit exceeded for IP ${ip}`);
    return { statusCode: 429, body: 'Too many requests' };
  }

  try {
    const client = twilio(accountSid, authToken);

    // Format message with timestamp
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
    const bodyText = `*New contact form message*\n*From:* ${name} (${email})\n*Subject:* ${subject || '-'}\n*Time (UTC):* ${timestamp}\n\n${message}`;

    const msg = await client.messages.create({
      from,
      to,
      body: bodyText
    });

    console.log('Sent Twilio message SID:', msg.sid);
    return { statusCode: 200, body: JSON.stringify({ ok: true, sid: msg.sid }) };
  } catch (err) {
    console.error('Twilio send error', err);
    return { statusCode: 500, body: 'Failed to send message' };
  }
};
