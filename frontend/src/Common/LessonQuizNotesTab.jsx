import React, { useState, useEffect, useContext } from 'react';
import { Box, Tabs, Tab, Paper, CircularProgress } from '@mui/material';
import Context from '../appContext';
import NotesEditor from './NotesEditor';
import QuizEditor from './QuizEditor';
import LessonPlanEditor from './LessonPlanEditor';

export default function LessonQuizNotesTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { transcript, lessonData, setLessonData, fetchAI } = useContext(Context);

  const fetchOpenAIContent = async (text) => {
    if (!lessonData?.id) return; // Only update if lesson already exists

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3010/api/v0/ai/gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(`AI fetch failed`);

      // Only update the content, keep the existing id
      setLessonData(prev => ({
        ...prev,
        title: json.content.lessonPlan?.title || prev.title,
        lessonPlanContent: json.content.lessonPlan,
        quizContent: json.content.quiz,
        notesContent: json.content.notes,
        transcript: text, // Redundant, but safe
      }));
    } catch (err) {
      console.error('AI fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transcript && fetchAI && lessonData?.id) {
      fetchOpenAIContent(transcript);
    }
  }, [transcript, fetchAI, lessonData?.id]);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const contentContainerSx = {
    p: 2,
    height: '85vh',
    overflowY: 'auto',
  };

  return (
    <Paper sx={{ width: '100%', minWidth: '40vw', height: '100%', display: 'flex' }}>
      <Box sx={{ width: '100%', mt: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Lesson Plan" />
          <Tab label="Quiz" />
          <Tab label="Notes" />
        </Tabs>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={contentContainerSx}>
            {activeTab === 0 && <LessonPlanEditor />}
            {activeTab === 1 && <QuizEditor />}
            {activeTab === 2 && <NotesEditor />}
          </Box>
        )}
      </Box>
    </Paper>
  );
}
