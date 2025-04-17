import Context from './appContext';
import LessonQuizNotesTabs from './LessonQuizNotesTab';
import VideoUpload from './VideoUpload';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import {Grid2, AppBar, Toolbar, Typography} from '@mui/material';
import theme from './theme.js';
import LessonsList from './LessonsList.jsx';
import LessonCreator from './LessonCreator.jsx';

/**
 * Where the app will be rendered
 * @returns {object} JSX
 */
function App() {
  const [videoFile, setVideoFile] = React.useState(null);
  const [videoId, setVideoId] = React.useState(null);
  const [transcript, setTranscript] = React.useState('');
  const [transcriptLoading, setTranscriptLoading] = React.useState(false);
  const [lessonData, setLessonData] = React.useState(null);
  const [lessons, setLessons] = React.useState([]);
  const [fetchAI, setFetchAI] = React.useState(true);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Context.Provider value={{videoFile, setVideoFile,
        transcript, setTranscript, transcriptLoading, setTranscriptLoading,
        lessonData, setLessonData, lessons, setLessons, videoId, setVideoId,
        fetchAI, setFetchAI,
      }}>
        <AppBar position="fixed" sx={{backgroundColor: theme.palette
            .primary.main}}>
          <Toolbar>
            <Typography variant="h6">
            AI Lesson Planner
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid2 container spacing={1}
          sx={{
            marginTop: '64px',
            flexDirection: 'row',
            justifyContent: 'center', // Centers items horizontally
            // minHeight: '100vh', // Ensures full height for vertical centering
          }}>
          <Grid2 xs={12} md={4}>
            <VideoUpload />
          </Grid2>
          <Grid2 xs={12} md={6}>
            <LessonQuizNotesTabs />
          </Grid2>
          <Grid2 xs={12} md={2}>
            <LessonsList />
          </Grid2>
        </Grid2>
        <LessonCreator />
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;
