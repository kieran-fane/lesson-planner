import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, TextField, IconButton, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Context from "../appContext";

export default function LessonPlanEditor() {
  const { lessonData, setLessonData } = useContext(Context);
  const didMountRef = useRef(false);

  // AI-generated plan or defaults
  const aiPlan = lessonData?.lessonPlanContent || {
    title: "",
    objectives: [],
    summary: "",
    activities: []
  };

  // Local state
  const [title, setTitle] = useState(aiPlan.title);
  const [objectives, setObjectives] = useState(aiPlan.objectives);
  const [summary, setSummary] = useState(aiPlan.summary);
  const [activities, setActivities] = useState(aiPlan.activities);

  // Reset when AI content changes
  useEffect(() => {
    setTitle(aiPlan.title || "");
    setObjectives(Array.isArray(aiPlan.objectives) ? aiPlan.objectives : []);
    setSummary(aiPlan.summary || "");
    setActivities(Array.isArray(aiPlan.activities) ? aiPlan.activities : []);
  }, [aiPlan.title, aiPlan.objectives, aiPlan.summary, aiPlan.activities]);

  // Sync back with guard and skip first render
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    // Only sync if lessonData exists and differs
    const current = lessonData?.lessonPlanContent;
    const next = { title, objectives, summary, activities };
    if (!current || JSON.stringify(current) !== JSON.stringify(next)) {
      setLessonData((prev) => ({
        ...prev,
        lessonPlanContent: next,
      }));
    }
  }, [title, objectives, summary, activities, setLessonData, lessonData]);

  // Handlers
  const updateArrayItem = (arr, setArr, idx, value) => {
    const updated = [...arr];
    updated[idx] = value;
    setArr(updated);
  };
  const deleteArrayItem = (arr, setArr, idx) => {
    setArr(arr.filter((_, i) => i !== idx));
  };
  const addArrayItem = (arr, setArr, defaultVal = "") => {
    setArr([...arr, defaultVal]);
  };

  return (
    <Box sx={{ pt: 1 }}>
      <TextField
        fullWidth
        label="Lesson Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle1">Objectives</Typography>
      {objectives.map((obj, idx) => (
        <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={obj}
            onChange={(e) => updateArrayItem(objectives, setObjectives, idx, e.target.value)}
          />
          <IconButton onClick={() => deleteArrayItem(objectives, setObjectives, idx)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={() => addArrayItem(objectives, setObjectives)} sx={{ mb: 2 }}>
        + Add Objective
      </Button>

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Typography variant="subtitle1">Activities</Typography>
      {activities.map((act, idx) => (
        <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={act}
            onChange={(e) => updateArrayItem(activities, setActivities, idx, e.target.value)}
          />
          <IconButton onClick={() => deleteArrayItem(activities, setActivities, idx)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={() => addArrayItem(activities, setActivities)}>
        + Add Activity
      </Button>
    </Box>
  );
}
