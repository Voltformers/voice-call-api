import { writeFileSync } from 'fs';
import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { base64Audio, fileName } = req.body;
  if (!base64Audio || !fileName) {
    return res.status(400).json({ message: 'Missing base64Audio or fileName' });
  }

  const filePath = `/tmp/${fileName}`;
  const audioBuffer = Buffer.from(base64Audio, 'base64');
  writeFileSync(filePath, audioBuffer);

  const fileUrl = `https://${req.headers.host}/api/audio/${fileName}`;
  return res.status(200).json({ url: fileUrl });
}
