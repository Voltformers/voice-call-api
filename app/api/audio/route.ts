import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { filename, base64Audio } = body;

    const buffer = Buffer.from(base64Audio, 'base64');
    const filePath = path.join('/tmp', filename);
    fs.writeFileSync(filePath, buffer);

    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const publicUrl = `${protocol}://${host}/api/audio/${filename}`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to save audio file' }, { status: 500 });
  }
}
