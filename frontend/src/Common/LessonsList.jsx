import { useEffect, useContext } from 'react';
import { Box, List, ListItem, Typography, Button } from '@mui/material';
import Context from '../appContext';

/**
 * Lesson List jsx
 * @returns {object} JSX
 */
function LessonsList() {
  const {
    setVideoFile,
    setTranscript,
    setLessonData,
    setVideoId,
    setFetchAI,
    lessons,
    setLessons,
    lessonData,
    videoFile,
  } = useContext(Context);

  useEffect(() => {
    async function fetchLessons() {
      const response = await fetch('http://localhost:3010/api/v0/lesson');
      const data = await response.json();
      setLessons(data.lessons);
    }
    fetchLessons();
  }, [setLessons]);

  const handleLessonClick = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:3010/api/v0/lesson/${lessonId}`);
      if (!response.ok) throw new Error('Lesson not found');
      const lR = await response.json();

      setVideoId(lR.lesson.videoId);
      setLessonData({
        id: lR.lesson.id,
        title: lR.lesson.data.name,
        lessonPlanContent: lR.lesson.data.lessonPlan,
        quizContent: lR.lesson.data.quiz,
        notesContent: lR.lesson.data.notes,
        transcript: lR.lesson.data.transcript,
      });
      setFetchAI(false);
      setTranscript(lR.lesson.data.transcript);
      setVideoFile({ id: lR.lesson.videoId, previewURL: null, name: lR.lesson.data.name });
    } catch (error) {
      console.error('Error loading lesson:', error);
    }
  };

  const handleNewLesson = () => {
    setVideoFile(null);
    setFetchAI(false);
    setTranscript('');
    setLessonData(null);
    setVideoId(null);
  };

  return (
    <Box sx={{ p: 2, width: '15vw' }}>
      <Typography variant="h5">Lessons</Typography>
      <Button
        variant="contained"
        onClick={handleNewLesson}
        sx={{ mt: 2 }}
      >
        New Lesson
      </Button>

      <List>
        {lessons.map((lesson) => {
          const isActive = lesson.id === lessonData?.id;
          let displayName;
          if (isActive) {
            displayName = lessonData?.title ||
              (videoFile?.name ? `Lesson from ${videoFile.name}` : 'Lesson');
          } else {
            displayName = lesson.data.name;
          }
          return (
            <ListItem
              key={lesson.id}
              button
              onClick={() => handleLessonClick(lesson.id)}
            >
              {displayName}
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

export default LessonsList;
