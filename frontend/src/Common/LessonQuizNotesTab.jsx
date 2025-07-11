import React from 'react';
import {Box, Tabs, Tab, Typography, Paper,
  CircularProgress} from '@mui/material';
import Context from '../appContext';
// import { error } from 'console';

/**
 * @returns {object} jsx
 */
function LessonQuizNotesTabs() {
  const [activeTab, setActiveTab] = React.useState(0);
  const [lessonPlan, setLessonPlan] = React.useState('');
  const [quiz, setQuiz] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const {transcript, lessonData, setLessonData,
    fetchAI} = React.useContext(Context);



  const fetchOpenAIContent = async (transcriptText) => {
    console.log('Fetch OpenAI Content');
    try {
      const quizResponse = await fetch('http://localhost:3010/api/v0/ai/gen', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({transcript: transcriptText, requestType: 'quiz'})
      });
      const notesResponse = await fetch('http://localhost:3010/api/v0/ai/gen', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({transcript: transcriptText, requestType: 'notes'})
      });
      const lessonPlanResponse = await fetch('http://localhost:3010/api/v0/ai/gen', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({transcript: transcriptText, requestType: 'lessonPlan'})
      });
      if (!quizResponse.ok || !notesResponse.ok || !lessonPlanResponse) throw new Error('Failed to save lesson');
      setQuiz(await quizResponse.json());
      setNotes(await notesResponse.json());
      setLessonPlan(await lessonPlanResponse.json());
      setLessonData({lessonPlanContent,
          quizContent, notesContent,
          });
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    if (transcript) {
      setIsLoading(true);
      (async () => {
        if (fetchAI) {
          await fetchOpenAIContent(transcript);
          // const quizStart = content.indexOf('Quiz');
          // const notesStart = content.indexOf('Notes');
          // const lessonPlanContent = content.slice(0, quizStart);
          // const quizContent = content.slice(quizStart, notesStart);
          // const notesContent = content.slice(notesStart);
          // setLessonPlan(lessonPlanContent);
          // setQuiz(quizContent);
          // setNotes(notesContent);
          // setLessonData({lessonPlanContent,
          //   quizContent, notesContent,
          // });
        }
        setIsLoading(false);
      })();
    }
  }, [transcript, fetchAI]);

  React.useEffect(() => {
    if (lessonData) {
      // console.log(lessonData);
      setLessonPlan(lessonData.lessonPlanContent || '');
      setQuiz(lessonData.quizContent || '');
      setNotes(lessonData.notesContent || '');
    } else {
      // Reset when "New Lesson" is clicked
      setLessonPlan('');
      setQuiz('');
      setNotes('');
    }
  }, [lessonData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const contentContainerSx = {
    p: 2,
    height: '80vh', // adjust based on your header/toolbars
    overflowY: 'auto',
  };

  const textSx = {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    mt: 1,
  };

  return (
    <Paper sx={{width: '100%', minWidth: '40vw', height: '100%', display:'flex'}}>
      <Box sx={{width: '100%', mt: 2, margin: 0}}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Lesson Plan" />
          <Tab label="Quiz" />
          <Tab label="Notes" />
        </Tabs>

        {isLoading ? (
          // Render loading indicator when waiting for the server response
          <Box sx={{display: 'flex', justifyContent: 'center',
            alignItems: 'center', height: '200px'}}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              <Box sx={contentContainerSx}>
                <Typography variant="h6">Lesson Plan</Typography>
                <Typography variant="body1" sx={textSx}>
                  {lessonPlan}
                </Typography>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={contentContainerSx}>
                <Typography variant="h6">Quiz</Typography>
                <Typography variant="body1" sx={textSx}>
                  {quiz}
                </Typography>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={contentContainerSx}>
                <Typography variant="h6">Notes</Typography>
                <Typography variant="body1" sx={textSx}>
                  {notes}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Paper>
  );
}

export default LessonQuizNotesTabs;
