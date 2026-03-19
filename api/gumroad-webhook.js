// Vercel serverless function
// Receives Gumroad sale pings and adds buyer to MailerLite group

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = '182342830527612581';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};

    const email = body.email;
    const fullName = body.full_name || '';
    const firstName = fullName.split(' ')[0] || '';

    if (!email) {
      console.error('No email in payload:', body);
      return res.status(400).json({ error: 'No email in payload' });
    }

    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        fields: { name: firstName },
        groups: [MAILERLITE_GROUP_ID],
      }),
    });

    const mlData = await mlRes.json();

    if (!mlRes.ok && mlRes.status !== 409) {
      console.error('MailerLite error:', mlData);
      return res.status(500).json({ error: 'MailerLite API error', details: mlData });
    }

    console.log('Subscriber added or already exists:', email);
    return res.status(200).json({ success: true, email });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal error', message: err.message });
  }
};
