import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {Card, CardContent, Typography,
  Box,
  CardMedia,
  Paper, CircularProgress} from '@mui/material';
import {styled} from '@mui/material/styles';
import Context from '../appContext';
import {transcribeVideoFile} from '../util/transcribe.js';

const FileInput = styled('input')({
  display: 'none',
});

/**
 * Creates the video upload component
 * @returns {object} JSX
 */
function VideoUpload() {
  const {videoFile, setVideoFile, setTranscriptLoading, setFetchAI,
    transcript, setTranscript, transcriptLoading, videoId, setVideoId,
  } = React.useContext(Context);

  const [previewURL, setPreviewURL] = useState(null);

  useEffect(() => {
    if (videoFile?.previewURL) {
      setPreviewURL(videoFile.previewURL);
    } else if (videoId) {
      setPreviewURL(`http://localhost:3010/api/v0/videos/${videoId}`); // Load from backend
    } else {
      setPreviewURL(null);
    }
  }, [videoFile, videoId]);

  // onDrop callback for react-dropzone
  const onDrop = React.useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      // Create a local preview URL and store it inside videoFile
      setVideoFile({
        file, // Preserve original file attributes
        name: file.name,
        previewURL: URL.createObjectURL(file),
        // Store preview URL inside the object
      });
      setVideoId(null);

      transcribeVideoFile(file,
          {
            setTranscriptLoading,
            setVideoId,
            setTranscript,
            setFetchAI,
          });
    }
  }, []);

  React.useEffect(() => {
    return () => {
      if (videoFile?.previewURL) {
        URL.revokeObjectURL(videoFile.previewURL);
      }
    };
  }, [videoFile]);
  // react-dropzone hooks
  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    // Limit to video files only
    accept: {
      'video/*': [],
    },
    multiple: false, // Set to false for single-file upload
  });

  return (
    <Card sx={{// width: '40vw',
      boxShadow: 3,
      borderRadius: 2,
      height: '100%'}}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Upload a Video
        </Typography>
        {videoFile ? (
          <Box mt={2}>
            <Typography variant="body1">
              Selected File: {videoFile.name}
            </Typography>
            <CardMedia
              component="video"
              controls
              src={previewURL} // Use preview URL from the object
              sx={{mt: 2, maxHeight: 300, objectFit: 'cover'}}
            />
          </Box>
        ) : (
          <Paper
            {...getRootProps()}
            variant="outlined"
            sx={{p: 2,
              textAlign: 'center',
              mt: 2, cursor: 'pointer',
              border: '2px dashed #ccc'}}
          >
            <FileInput {...getInputProps()} />
            <Typography>
              {isDragActive ? 'Drop your video file here ...' :
              'Drag & drop a video, or click to select a file'}
            </Typography>
          </Paper>
        )}
        {/* Transcript Section */}
        <Box mt={2}>
          <Typography variant="h6" gutterBottom>Transcript</Typography>
          <Paper sx={{height: '35vh',
            overflowY: 'auto', p: 2,
            border: '1px solid #ccc'}}>
            {transcriptLoading ? (
              <Box sx={{display: 'flex',
                justifyContent: 'center',
                alignItems: 'center', height: '100%'}}>
                <CircularProgress />
              </Box>
            ) : (
              <Typography variant="body2"
                sx={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                {transcript}
              </Typography>
            )}
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
}

export default VideoUpload;
