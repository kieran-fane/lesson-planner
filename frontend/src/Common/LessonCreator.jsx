import {useEffect, useContext} from 'react';
import Context from '../appContext';

/**
 * The code to handle updating the backend after lesson created
 * @returns {object} nothing
 */
function LessonCreator() {
  const {videoFile, videoId, transcript,
    lessonData, setLessons} = useContext(Context);
  useEffect(() => {
    if (!videoId || !transcript || !lessonData) return;

    /**
     * Saves lesson to backend
     */
    async function saveLesson() {
      try {
        // console.log('video file DATA: ', videoFile);
        const lesson = {
          name: `Lesson from ${videoFile.name}`,
          videoId,
          transcript,
          ...lessonData,
        };

        const response = await fetch('http://localhost:3010/api/v0/lesson', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(lesson),
        });

        if (!response.ok) throw new Error('Failed to save lesson');
        const savedLesson = await response.json();
        // Update lessons list with the new lesson
        setLessons((prev) => [...prev, {id: savedLesson.lessonId,
          data: lesson}]);
      } catch (error) {
        console.error('Error saving lesson:', error);
      }
    }
    saveLesson();
  }, [videoId, transcript, lessonData]);

  return null; // No UI needed
}

export default LessonCreator;
