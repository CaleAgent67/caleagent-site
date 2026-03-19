// Vercel serverless function
// Receives Gumroad sale webhooks and adds buyer to MailerLite group

const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = '182342830527612581';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Gumroad sends form-encoded data
    const body = req.body;

    const email = body.email;
    const name = body.full_name || body.email;
    const firstName = name.split(' ')[0] || '';

    if (!email) {
      return res.status(400).json({ error: 'No email in payload' });
    }

    // Add subscriber to MailerLite group
    const mlRes = await fetch(`https://connect.mailerlite.com/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify({
        email: email,
        fields: {
          name: firstName,
        },
        groups: [MAILERLITE_GROUP_ID],
      }),
    });

    const mlData = await mlRes.json();

    if (!mlRes.ok) {
      console.error('MailerLite error:', mlData);
      return res.status(500).json({ error: 'MailerLite API error', details: mlData });
    }

    console.log('Subscriber added:', email);
    return res.status(200).json({ success: true, email });

  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).json({ error: 'Internal error', message: err.message });
  }
}
