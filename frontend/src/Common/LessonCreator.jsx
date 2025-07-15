import {useEffect, useContext} from 'react';
import Context from '../appContext';

/**
 * The code to handle updating the backend after lesson created
 * @returns {object} nothing
 */
function LessonCreator() {
  const {videoFile, videoId, transcript,
    lessonData, setLessons, setLessonData} = useContext(Context);
  useEffect(() => {
    if (!videoId || !transcript || !lessonData) return;

    async function saveOrUpdate() {
      const payload = {
        name: lessonData.title || `Lesson from ${videoFile?.name || 'file'}`,
        videoId,
        transcript,
        lessonPlan: lessonData.lessonPlanContent,
        quiz: lessonData.quizContent,
        notes: lessonData.notesContent,
      };

      // Decide between create vs update
      const url = lessonData.id
        ? `http://localhost:3010/api/v0/lesson/${lessonData.id}`
        : 'http://localhost:3010/api/v0/lesson';
      const method = lessonData.id ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Save failed');

        const result = await res.json();

        // If we just created, update the id and list
        if (!lessonData.id) {
          setLessons((prev) => [
            ...prev,
            { id: result.lessonId, data: payload },
          ]);
          setLessonData((prev) => ({ ...prev, id: result.lessonId }));
        }

      } catch (err) {
        console.error('Error saving/updating lesson:', err);
      }
    }

    saveOrUpdate();
  }, [videoId, transcript, lessonData]);

  return null; // No UI needed
}

export default LessonCreator;
