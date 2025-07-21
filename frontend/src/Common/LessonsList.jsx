import { useEffect, useContext } from 'react';
import { Box, List, ListItemButton, Typography, Button } from '@mui/material';
import Context from '../appContext';

/**
 * Lesson List jsx
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
    videoFile
  } = useContext(Context);

  // 1) Initial fetch
  useEffect(() => {
    async function fetchLessons() {
      const response = await fetch('http://localhost:3010/api/v0/lesson');
      const data = await response.json();
      setLessons(data.lessons);
    }
    fetchLessons();
  }, [setLessons]);

  // 2) When you edit the lesson title, update it in the list array too
  useEffect(() => {
    if (lessonData?.id && lessonData.title) {
      setLessons(prev =>
        prev.map(l =>
          l.id === lessonData.id
            ? { 
                ...l, 
                data: { 
                  ...l.data, 
                  name: lessonData.title 
                } 
              }
            : l
        )
      );
    }
  }, [lessonData?.id, lessonData?.title, setLessons]);

  // 3) Handle selecting a lesson: load its data and set up the video preview URL
  const handleLessonClick = async (lessonId) => {
    try {
      const res = await fetch(`http://localhost:3010/api/v0/lesson/${lessonId}`);
      if (!res.ok) throw new Error('Lesson not found');
      const { lesson: lR } = await res.json();

      // set the videoId so VideoUpload can fall back on it…
      // console.log(JSON.stringify(lR));
      setVideoId(lR.videoId);

      // …and also shove the previewURL into videoFile so we get it immediately
      const remoteURL = `http://localhost:3010/api/v0/video/${lR.video_id}`;
      setVideoFile({
        previewURL: remoteURL,
        name: lR.data.name,
      });

      setLessonData({
        id: lR.id,
        title: lR.data.name,
        lessonPlanContent: lR.data.lessonPlan,
        quizContent: lR.data.quiz,
        notesContent: lR.data.notes,
        transcript: lR.data.transcript,
      });
      setTranscript(lR.data.transcript);
      setFetchAI(false);
    } catch (err) {
      console.error('Error loading lesson:', err);
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
      <Button variant="contained" onClick={handleNewLesson} sx={{ mt: 2 }}>
        New Lesson
      </Button>

      <List>
        {lessons.map(l => {
          const defaultName = `Lesson from ${videoFile?.name}`;
          const storedName  = l.data?.name || defaultName;
          const isActive    = lessonData?.id === l.id;
          // if this is the lesson we're editing, show the live title
          const displayName = isActive
            ? (lessonData.title || storedName)
            : storedName;

          return (
            <ListItemButton
              key={l.id}
              onClick={() => handleLessonClick(l.id)}
              selected={isActive}
            >
              {displayName}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export default LessonsList;
