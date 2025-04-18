/* eslint-disable no-undef */
/* eslint-env browser */

/**
 * Uploads a video file to the backend and updates context state with
 * the returned video ID and transcript.
 * @param {File} file - The video file to transcribe.
 * @param {object} handlers - State‐updating functions from context.
 * @param {function(boolean): void} handlers.setTranscriptLoading - Toggle loading spinner.
 * @param {function(string): void} handlers.setVideoId - Store the returned video ID.
 * @param {function(string): void} handlers.setTranscript - Store the returned transcript.
 * @param {function(boolean): void} handlers.setFetchAI - Enable AI processing after transcription.
 * @returns {Promise<void>} Resolves when the transcription request completes.
 */
export async function transcribeVideoFile(
    file,
    {setTranscriptLoading, setVideoId, setTranscript, setFetchAI},
) {
  setTranscriptLoading(true);

  try {
    const formData = new FormData();
    formData.append('video', file, file.name);

    const response = await fetch('http://localhost:3010/api/v0/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Transcription failed on the server.');
    }

    const {videoId, transcript} = await response.json();
    setVideoId(videoId);
    setFetchAI(true);
    setTranscript(transcript);
  } catch (error) {
    console.error('Error transcribing video:', error);
  } finally {
    setTranscriptLoading(false);
  }
}
