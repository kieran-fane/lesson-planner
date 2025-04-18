import React from 'react';
import {Grid2, AppBar, Toolbar, Typography} from '@mui/material';
import VideoUpload         from '../Common/VideoUpload';
import LessonQuizNotesTab from '../Common/LessonQuizNotesTab';
import LessonsList         from '../Common/LessonsList';
import LessonCreator       from '../Common/LessonCreator';

export default function DesktopLayout() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">AI Lesson Planner</Typography>
        </Toolbar>
      </AppBar>

      <Grid2
        container
        spacing={2}
        direction="row"
        justifyContent="center"
        sx={{ mt: '64px' }}
      >
        <Grid2 item xs={12} md={4}><VideoUpload /></Grid2>
        <Grid2 item xs={12} md={6}><LessonQuizNotesTab /></Grid2>
        <Grid2 item xs={12} md={2}><LessonsList /></Grid2>
      </Grid2>

      <LessonCreator />
    </>
  );
}
