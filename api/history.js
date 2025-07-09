// api/history.js
// Vercel Serverless Function proxying to your Google Sheets Apps Script

export default async function handler(req, res) {
  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwq1z4rfhm9-dZQ_NX5FEoOphQ-GxomXkVQrQmj7bmLcFXRf_7AOLfRKLRM4sCIDU8Q/exec';

  try {
    if (req.method === 'GET') {
      // Fetch the full history from Google Sheets
      const sheetRes = await fetch(SHEETS_URL);
      if (!sheetRes.ok) {
        throw new Error(`Sheet GET failed: ${sheetRes.status}`);
      }
      const history = await sheetRes.json();
      return res.status(200).json(history);
    }

    if (req.method === 'POST') {
      // Expect JSON: { meal: string, date: string }
      const { meal, date } = req.body;
      if (!meal || !date) {
        return res.status(400).json({ error: 'Missing meal or date' });
      }

      // Proxy the POST to Google Sheets
      const postRes = await fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meal, date })
      });
      if (!postRes.ok) {
        throw new Error(`Sheet POST failed: ${postRes.status}`);
      }
      const result = await postRes.json();
      return res.status(200).json(result);
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end();
  } catch (err) {
    console.error('Function error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
