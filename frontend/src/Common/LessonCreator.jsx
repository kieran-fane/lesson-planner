import { useEffect, useContext, useRef } from 'react';
import Context from '../appContext';

/**
 * Handles creating or updating the backend when lessonData changes.
 */
function LessonCreator() {
  const {
    videoFile, videoId, transcript,
    lessonData, setLessons, setLessonData
  } = useContext(Context);

  const didMountRef = useRef(false);
  const debounceTimer = useRef(null);
  const lastSavedLessonId = useRef(null); // prevents re-posting same new lesson repeatedly

  useEffect(() => {
    if (!videoId || !transcript || !lessonData) return;

    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      const payload = {
        name: lessonData.title || `Lesson from ${videoFile?.name || 'file'}`,
        videoId,
        transcript,
        lessonPlan: lessonData.lessonPlanContent,
        quiz: lessonData.quizContent,
        notes: lessonData.notesContent,
      };

      const saveLesson = async () => {
        try {
          const res = await fetch('http://localhost:3010/api/v0/lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Create failed');
          const result = await res.json();

          lastSavedLessonId.current = result.lessonId;

          setLessons((prev) => [
            ...prev,
            { id: result.lessonId, data: payload },
          ]);
          setLessonData((prev) => ({ ...prev, id: result.lessonId }));
        } catch (err) {
          console.error('Error creating lesson:', err);
        }
      };

      const updateLesson = async () => {
        console.log('In Update');
        try {
          const res = await fetch(`http://localhost:3010/api/v0/lesson/${lessonData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Update failed');
          console.log('Lesson updated');
        } catch (err) {
          console.error('Error updating lesson:', err);
        }
      };

      if (lessonData.id) {
        updateLesson();
      } else if (lastSavedLessonId.current !== lessonData.id) {
        saveLesson();
      }
    }, 500); // Debounce delay
  }, [videoId, transcript, lessonData]);

  return null;
}

export default LessonCreator;
