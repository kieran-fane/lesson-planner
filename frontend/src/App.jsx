import React from 'react';
import Context from './appContext';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

import DesktopLayout from './Desktop/Layout';
import MobileLayout  from './Mobile/Layout';
import WideLayout    from './Wide/Layout';

function App() {
  const [videoFile, setVideoFile]         = React.useState(null);
  const [videoId, setVideoId]             = React.useState(null);
  const [transcript, setTranscript]       = React.useState('');
  const [transcriptLoading, setTranscriptLoading] = React.useState(false);
  const [lessonData, setLessonData]       = React.useState(null);
  const [lessons, setLessons]             = React.useState([]);
  const [fetchAI, setFetchAI]             = React.useState(true);

  const muiTheme = useTheme();
  const [screenSize, setScreenSize] = React.useState(window.innerWidth);

  React.useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Layout =
  screenSize <= 800
    ? MobileLayout
    : screenSize <= 1000
      ? WideLayout
      : DesktopLayout;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Context.Provider value={{
        videoFile, setVideoFile,
        videoId, setVideoId,
        transcript, setTranscript,
        transcriptLoading, setTranscriptLoading,
        lessonData, setLessonData,
        lessons, setLessons,
        fetchAI, setFetchAI,
      }}>
        <Layout />
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;