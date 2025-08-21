import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, base64Audio } = req.body;

    const buffer = Buffer.from(base64Audio, 'base64');
    const filePath = path.join('/tmp', filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `https://${req.headers.host}/api/audio/${filename}`;
    return res.status(200).json({ url: publicUrl });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save audio file' });
  }
}
