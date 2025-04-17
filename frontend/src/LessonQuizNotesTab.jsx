import React from 'react';
import {Box, Tabs, Tab, Typography, Paper,
  CircularProgress} from '@mui/material';
import Context from './appContext';

const fetchOpenAIContent = async (transcriptText) => {
  console.log('Fetch OpenAI Content');
  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OpenAI API key');
    }
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an educational assistant
                      that creates lesson plans, quizzes, and fill-in-the-blank
                      notes based on provided transcript from a lesson/lecture.
                      You don't make any other sections.`,
          },
          {
            role: 'user',
            content: `Generate a lesson plan, a quiz,
                      and fill-in-the-blank notes based on the 
                      following transcript:\n\n
                      ${transcriptText}\n\n
                      DO NOT ADD ANY OTHER SECTIONS. ONLY THE ONES ASKED FOR.
                      (SO YOU WOULD DO 'Lesson Plan:... Quiz:... Notes:...)
                      ONLY DO THOSE 
                      3 SECTIONS WITH THE PROVIDED STRUCTURE.
                      ONLY PROVIDE 
                      1. A LESSON PLAN, 
                      2. A MULTIPLE CHOICE QUIZ (at least 5 questions),
                      3. FILL IN THE BLANK NOTES.
                      For the notes leave blanks using 
                      '______' so that students can write in 
                      what should go there. 
                      Only take the critical information 
                      for notes and quizzes.`,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '<could not read body>');
      console.error('OpenAI API returned non-OK:',
          {
            status: response.status,
            statusText: response.statusText,
            headers: [...response.headers.entries()],
            body: text,
          },
      );
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    const data = await response.json();
    const content = data.choices[0].message.content;
    return {content};
  } catch (error) {
    console.error('Error fetching OpenAI content:', {
      message: error.message,
      stack: error.stack,
      // if you ever wrap a fetch exception that has no “response” itself,
      // you’ll see it here
      original: error,
    });
    // re‑throw if you want to let a boundary catch it, or
    // return something so your UI can handle it gracefully:
    return {content: ''};
  }
};

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

  React.useEffect(() => {
    if (transcript) {
      setIsLoading(true);
      (async () => {
        if (fetchAI) {
          const {content} = await fetchOpenAIContent(transcript);
          const quizStart = content.indexOf('Quiz');
          const notesStart = content.indexOf('Notes');
          const lessonPlanContent = content.slice(0, quizStart);
          const quizContent = content.slice(quizStart, notesStart);
          const notesContent = content.slice(notesStart);
          setLessonPlan(lessonPlanContent);
          setQuiz(quizContent);
          setNotes(notesContent);
          setLessonData({lessonPlanContent,
            quizContent, notesContent,
          });
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
      // ✅ Reset when "New Lesson" is clicked
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
    <Paper sx={{width: '40vw', height: '100%'}}>
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
