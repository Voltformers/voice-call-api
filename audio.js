import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const { base64Audio, dataBase64, filename = `audio-${Date.now()}.mp3` } = req.body || {};
    const b64 = dataBase64 || base64Audio;
    if (!b64) return res.status(400).json({ error: 'Missing base64Audio/dataBase64' });

    const bytes = Buffer.from(b64, 'base64');
    const { url } = await put(`audio/${filename}`, bytes, {
      access: 'public',
      contentType: 'audio/mpeg',
    });

    return res.status(200).json({ url });
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Upload failed' });
  }
}
