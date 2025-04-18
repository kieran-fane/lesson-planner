import React from 'react';
import { Grid2, AppBar, Toolbar, Typography, Box } from '@mui/material';
import VideoUpload         from '../Common/VideoUpload';
import LessonQuizNotesTab from '../Common/LessonQuizNotesTab';
import LessonsList         from '../Common/LessonsList';
import LessonCreator       from '../Common/LessonCreator';

export default function WideLayout() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">AI Lesson Planner — Wide View</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: '64px', px: 4, maxWidth: 1600, mx: 'auto' }}>
        <Grid2
          container
          spacing={4}
          direction="row"
          justifyContent="space-between"
        >
          <Grid2 item xs={12} md={3}><VideoUpload /></Grid2>
          <Grid2 item xs={12} md={6}><LessonQuizNotesTab /></Grid2>
          <Grid2 item xs={12} md={3}><LessonsList /></Grid2>
        </Grid2>
      </Box>

      <LessonCreator />
    </>
  );
}
