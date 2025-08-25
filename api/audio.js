import { put } from '@vercel/blob';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: 'Only POST requests allowed' });
    }

    const { fileName, base64Audio } = req.body || {};
    if (!fileName || !base64Audio) {
      return res.status(400).json({ message: 'Missing fileName or base64Audio' });
    }

    // Konwersja base64 -> buffer
    const contentType = fileName.endsWith('.mp3') ? 'audio/mpeg' : 'application/octet-stream';
    const bytes = Buffer.from(base64Audio, 'base64');

    // Upload do Vercel Blob
    const { url } = await put(`audio/${fileName}`, bytes, {
      access: 'public',
      contentType,
    });

    return res.status(200).json({ url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Upload failed', error: String(e?.message || e) });
  }
}
