// api/history.js
import { VercelKV } from '@vercel/kv';

const kv = new VercelKV();
const KEY = 'meal-history';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const history = (await kv.get(KEY)) || [];
    return res.status(200).json(history);
  }
  if (req.method === 'POST') {
    const { meal, date } = req.body;
    if (!meal || !date) return res.status(400).json({ error: 'Missing meal or date' });
    const history = (await kv.get(KEY)) || [];
    if (!history.find(e => e.meal === meal && e.date === date)) {
      history.push({ meal, date });
      await kv.set(KEY, history);
    }
    return res.status(200).json({ ok: true });
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
