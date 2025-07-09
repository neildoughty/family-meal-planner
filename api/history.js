// api/history.js
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const KEY = 'meal-history';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = await redis.get(KEY);
    return res.status(200).json(data ? JSON.parse(data) : []);
  }
  if (req.method === 'POST') {
    const { meal, date } = req.body;
    const data = await redis.get(KEY);
    const history = data ? JSON.parse(data) : [];
    if (!history.find(e => e.meal === meal && e.date === date)) {
      history.push({ meal, date });
      await redis.set(KEY, JSON.stringify(history));
    }
    return res.status(200).json({ ok: true });
  }
  res.setHeader('Allow', ['GET','POST']);
  res.status(405).end();
}
