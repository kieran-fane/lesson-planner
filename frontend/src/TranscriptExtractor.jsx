import {useEffect, useContext} from 'react';
import Context from './appContext';

/**
 * @returns {object} nothin
 */
function TranscriptExtractor() {
  const {videoFile, setVideoId,
    setTranscript, setTranscriptLoading, videoId,
    setFetchAI} =
    useContext(Context);

  useEffect(() => {
    if (!videoFile || !videoFile.file || videoId) return;

    /**
     *
     */
    async function transcribeVideo() {
      setTranscriptLoading(true);
      try {
        // Log the file size to verify the file is complete.
        // console.log('Video file size:', videoFile.size);

        // Create a FormData object and append the whole file.
        const formData = new FormData();
        formData.append('video', videoFile.file, videoFile.file.name);

        // Send the file to your backend server.
        const response = await fetch('http://localhost:3010/api/v0/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          // console.log(response);
          throw new Error('Transcription failed on the server.');
        }
        // console.log(response);
        const data = await response.json();
        setVideoId(data.videoId);
        setFetchAI(true);
        setTranscript(data.transcript);
      } catch (error) {
        console.error('Error transcribing video:', error);
      }
      setTranscriptLoading(false);
    }

    transcribeVideo();
  }, [videoFile, setTranscript]);

  return null;
}

export default TranscriptExtractor;
