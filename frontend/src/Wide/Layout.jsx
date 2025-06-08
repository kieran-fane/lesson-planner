import React from 'react';
import { Grid, AppBar, Toolbar, Typography, Box } from '@mui/material';
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
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={3}><VideoUpload /></Grid>
          <Grid item xs={12} md={3}><LessonQuizNotesTab /></Grid>
          <Grid item xs={12} md={3}><LessonsList /></Grid>
        </Grid>
      </Box>

      <LessonCreator />
    </>
  );
}
