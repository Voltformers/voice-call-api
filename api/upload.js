import { writeFileSync } from 'fs';
import { Buffer } from 'buffer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  const { filename, base64Audio } = req.body;

  if (!filename || !base64Audio) {
    return res.status(400).json({ message: 'Missing base64Audio or filename' });
  }

  const audioBuffer = Buffer.from(base64Audio, 'base64');

  const fs = require('fs');
  const path = require('path');

  const folderPath = path.join(process.cwd(), 'public', 'audios');
  const filePath = path.join(folderPath, filename);

  // Tworzymy folder, jeśli nie istnieje
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  writeFileSync(filePath, audioBuffer);

  const url = `${req.headers.host}/audios/${filename}`;
  return res.status(200).json({ url });
}
