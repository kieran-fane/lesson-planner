import * as db from './db.js';

export async function getVideo(req, res) {
  try {
    // db.getVideoById returns the JSONB “data” object:
    // { metadata: { mimetype, filename }, video: "<base64 string>", transcript: ... }
    const data = await db.getVideoById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Decode the Base64 into a Buffer
    const buffer = Buffer.from(data.video, 'base64');

    // Tell the client it’s a real video stream
    res.writeHead(200, {
      'Content-Type': data.metadata.mimetype,
      'Content-Length': buffer.length,
      // optional: allow ranged requests for seeking
      'Accept-Ranges': 'bytes',
    });
    return res.end(buffer);
  } catch (err) {
    console.error('Error streaming video:', err);
    return res.status(500).json({ error: 'Failed to stream video' });
  }
}
