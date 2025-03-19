import fs from 'fs';
import { execFile } from 'child_process';
import path from 'node:path';
import { saveVideo, updateVideoWithTranscript } from './db.js';

const transcribeScriptPath = path.resolve('src/transcribe.py');

/**
 * Handles video upload & passes it directly to Whisper transcription.
 */
export const uploadVideo = async (req, res) => {
    // console.log('IN UPLOAD');
    if (!req.file) {
        console.log('no file');
        return res.status(400).json({ error: 'No video file provided' });
    }

    console.log(`Uploaded file: ${req.file.path}, Size: ${req.file.size} bytes`);

    try {
        // Save metadata & video in database first
        const metadata = {filename: req.file.originalname, mimetype: req.file.mimetype};
        const videoId = await saveVideo(metadata, fs.readFileSync(req.file.path));

        // console.log(`Saved video with ID: ${videoId}`);

        // Call Whisper transcription
        execFile('python', [transcribeScriptPath, req.file.path], async (error, stdout, stderr) => {
            // Remove temp video file after processing
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });

            if (error) {
                console.error('Transcription failed:', stderr);
                return res.status(500).json({error: 'Transcription failed'});
            }

            const transcript = stdout.trim();
            // console.log(`Transcript for video ${videoId}: ${transcript}`);

            // Update JSONB with transcript
            await updateVideoWithTranscript(videoId, transcript);

            res.json({success: true, videoId, transcript});
            // console.log(res);
        });

    } catch (error) {
        console.error('Error processing video:', error);
        res.status(500).json({error: 'Failed to store video'});
    }
};

export default uploadVideo;
