export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });

  const MAILERLITE_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZTcwMGY1Mjk2M2UyZjJlYzc0YjVlYjI1MTcyMDkwZTFhYzc0NTliYWYzZDE2MzQ3ZmRlZDdiMGQyMmQ5NDNjNjdjOGMwMmY0YjJhYzdiZmQiLCJpYXQiOjE3NzM4OTY4MTEuNDc5MzY4LCJuYmYiOjE3NzM4OTY4MTEuNDc5MzcyLCJleHAiOjQ5Mjk1NzA0MTEuNDcxOTk1LCJzdWIiOiIyMjI0NjA2Iiwic2NvcGVzIjpbXX0.P3Mx27XX_rv_YeUiSR3Z37PP02N9t_2J_meDMzGYE7qwa9THu47031g-zeaOBPQjL6IL9_sbSpmyN5WSUkxC6NCaASkfxd0Zr9zuDopUfk70NZEzv4-82bjTtm0mVs6OLkzbgvDyzWg9rXUkErTsZgptcMqv6y697jZWbIP7HBkVR__M50sgGKY38vvnJcDzFo9UpAGXSA0f5B03UYvmtrJlyjkxJse_hbpRKjuju36JYiV3Ex0BkyYQ08KC9GeMvPQ98EAvdWyX3wNPepRToTHx8jSYWLs-uzyJwsHG_NmzmrzhJ2SNLcDsuyukHSbNFGwN0H6rzoQXu_w7TLB-zDSYMBl8pMWXbTFJWmsd8Iqn8S8HF5N3pf_AMrt3FTD-kdVQHZTMizUz5hK5O8ECecbEAHtdtjOqbMHbxoL-seuhE1-HnBdTmX4P8x_oxPps9D6-UUYjREI8aAvvibSjYFETVklJjpXVu5MI3klJqzUeHTgbQQB6l_hnIplwbQmonmI7yv0owBTF917UYzHbHt6wD12CLfAYjJQcog63y4e4XJF7rzG1GriHx4F0-h9H6zEDn63GjPyf46I5guFwCrHl_NSGdFG3nhtvRBBtTRmsLg5Aid3Y5nzxa3eNAUdkK6pvEfta_0hI2hTUHExCKa2kOsg8rL4oEPVO8J0z8Us';
  const GROUP_ID = '182342830527612581';

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MAILERLITE_KEY}`
      },
      body: JSON.stringify({
        email,
        groups: [GROUP_ID]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('MailerLite error:', data);
      return res.status(200).json({ success: true }); // Return success to user anyway
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
