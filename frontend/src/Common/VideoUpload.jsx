import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CardMedia,
  Paper,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Context from '../appContext';
import { transcribeVideoFile } from '../util/transcribe.js';

const FileInput = styled('input')({
  display: 'none',
});

export default function VideoUpload() {
  const {
    videoFile,
    setVideoFile,
    setTranscriptLoading,
    setFetchAI,
    transcript,
    setTranscript,
    transcriptLoading,
    videoId,
    setVideoId,
    setLessonData,
    setLessons
  } = useContext(Context);

  const [previewURL, setPreviewURL] = useState(null);
  const videoRef = useRef(null);

  // Manage preview URL: BACKEND URL takes priority every time
  useEffect(() => {
    if (videoId) {
      // always point at the backend for playback
      setPreviewURL(`http://localhost:3010/api/v0/video/${videoId}`);
    } else if (videoFile?.previewURL) {
      // fallback to local object URL on initial upload
      setPreviewURL(videoFile.previewURL);
    } else {
      setPreviewURL(null);
    }
  }, [videoFile, videoId]);

  // Force video to reload when src changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [previewURL]);

  // onDrop callback
  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    const name = file.name;

    // 1) Immediate local preview
    const localURL = URL.createObjectURL(file);
    setVideoFile({ file, name, previewURL: localURL });
    setVideoId(null);
    setTranscript('');
    setFetchAI(false);

    // 2) Create placeholder lesson in the DB
    try {
      const placeholder = {
        name: `Lesson from ${name}`,
        videoId: null,
        transcript: '',
        lessonPlan: null,
        quiz: null,
        notes: null,
      };

      const res = await fetch('http://localhost:3010/api/v0/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeholder),
      });
      if (!res.ok) throw new Error('Failed to create placeholder');
      const { lessonId } = await res.json();

      setLessonData({
        id: lessonId,
        title: placeholder.name,
        lessonPlanContent: null,
        quizContent: null,
        notesContent: null,
        transcript: '',
      });
      setLessons(prev => [
        ...prev,
        { id: lessonId, data: { name: placeholder.name } }
      ]);
    } catch (err) {
      console.error('Error creating placeholder lesson:', err);
    }

    // 3) Kick off transcription & AI pipeline
    transcribeVideoFile(file, {
      setTranscriptLoading,
      setVideoId,
      setTranscript,
      setFetchAI,
    });
  }, [
    setVideoFile,
    setVideoId,
    setTranscript,
    setFetchAI,
    setTranscriptLoading,
    setLessonData,
    setLessons,
  ]);

  // Cleanup local object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (videoFile?.previewURL) {
        URL.revokeObjectURL(videoFile.previewURL);
      }
    };
  }, [videoFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': [] },
    multiple: false,
  });

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Upload a Video
        </Typography>

        {videoFile || videoId ? (
          <Box mt={2}>
            <Typography variant="body1">
              Selected File: {videoFile?.name}
            </Typography>
            <CardMedia
              component="video"
              controls
              src={previewURL}
              ref={videoRef}
              sx={{ mt: 2, maxHeight: 300, objectFit: 'cover' }}
            />
          </Box>
        ) : (
          <Paper
            {...getRootProps()}
            variant="outlined"
            sx={{
              p: 2,
              textAlign: 'center',
              mt: 2,
              cursor: 'pointer',
              border: '2px dashed #ccc'
            }}
          >
            <FileInput {...getInputProps()} />
            <Typography>
              {isDragActive
                ? 'Drop your video file here ...'
                : 'Drag & drop a video, or click to select a file'}
            </Typography>
          </Paper>
        )}

        <Box mt={2}>
          <Typography variant="h6" gutterBottom>
            Transcript
          </Typography>
          <Paper sx={{ height: '35vh', overflowY: 'auto', p: 2, border: '1px solid #ccc' }}>
            {transcriptLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Typography
                variant="body2"
                sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              >
                {transcript}
              </Typography>
            )}
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
}
