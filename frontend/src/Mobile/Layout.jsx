import React from 'react';
import { Stack, AppBar, Toolbar, Typography, Box } from '@mui/material';
import VideoUpload         from '../Common/VideoUpload';
import LessonQuizNotesTab from '../Common/LessonQuizNotesTab';
import LessonsList         from '../Common/LessonsList';
import LessonCreator       from '../Common/LessonCreator';

export default function MobileLayout() {
  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">AI Lesson Planner</Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: '64px', p: 2 }}>
        <Stack spacing={3}>
          <VideoUpload />
          <LessonQuizNotesTab />
          <LessonsList />
        </Stack>
      </Box>

      <LessonCreator />
    </>
  );
}