// app/api/audio/index.js
import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { base64Audio } = req.body || {};
    if (!base64Audio) {
      return res.status(400).json({ error: 'Missing base64Audio' });
    }

    // Tworzymy nazwę pliku .mp3
    const filename = `audio-${Date.now()}.mp3`;
    const bytes = Buffer.from(base64Audio, 'base64');

    // Zapis do Vercel Blob Storage
    const { url } = await put(`audio/${filename}`, bytes, {
      access: 'public',
      contentType: 'audio/mpeg',
    });

    // Zwracamy publiczny URL
    return res.status(200).json({ url });

  } catch (e) {
    console.error('Upload error:', e);
    return res.status(500).json({ error: 'Upload failed', details: e.message });
  }
}
