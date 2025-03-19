import {useEffect, useContext} from 'react';
import {Box, List, ListItem, Typography, Button} from '@mui/material';
import Context from './appContext';

// TODO FIX THE previewURL so that it works with switching videos

/**
 * Lesson List jsx
 * @returns {object} JSX
 */
function LessonsList() {
  const {setVideoFile, setTranscript, setLessonData,
    setVideoId, setFetchAI, lessons, setLessons} = useContext(Context);
  // const [lessons, setLessons] = useState([]);

  useEffect(() => {
    /**
     *
     */
    async function fetchLessons() {
      const response = await fetch('http://localhost:3010/api/v0/lesson');
      // console.log(response);
      const data = await response.json();
      // console.log('IN FETCH ', data.lesson);
      setLessons(data.lessons);
      // .then((data) => setLessons(data))
    }
    fetchLessons();
  }, []);

  const handleLessonClick = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:3010/api/v0/lesson/${lessonId}`);
      if (!response.ok) throw new Error('Lesson not found');
      const lR = await response.json();

      setVideoId(lR.lesson.videoId);
      setLessonData({
        lessonPlanContent: lR.lesson.data.lessonPlan,
        quizContent: lR.lesson.data.quiz,
        notesContent: lR.lesson.data.notes,
      });
      setFetchAI(false);
      setTranscript(lR.lesson.data.transcript);
      // console.log(lR);

      setVideoFile({id: lR.lesson.videoId, previewURL: null});
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
    <Box sx={{p: 2, width: '15vw'}}>
      <Typography variant="h5">Lessons</Typography>
      <Button variant="contained"
        onClick={handleNewLesson} sx={{mt: 2}}>New Lesson</Button>
      <List>
        {lessons.map((lesson) => {
          // console.log('RENDER ', lessons);
          return (
            <ListItem key={lesson.id} button='true'
              onClick={() => handleLessonClick(lesson.id)}>
              {lesson.data.name}
            </ListItem>);
        },
        )}
      </List>
    </Box>
  );
}

export default LessonsList;
