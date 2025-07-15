// src/components/NotesEditor.jsx
import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, TextField, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Context from "../appContext";

export default function NotesEditor() {
  const { lessonData, setLessonData } = useContext(Context);

  // AI notes or one blank
  const aiNotes = lessonData?.notesContent?.notes || [];
  const initialNotes = aiNotes.length > 0 ? aiNotes : [""];

  const [notes, setNotes] = useState(initialNotes);
  const didMountRef = useRef(false);

  // Reset when AI content changes
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  // Sync back—but skip the very first render and only if it actually changed
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const current = lessonData?.notesContent?.notes;
    // skip if identical
    if (!current || JSON.stringify(current) !== JSON.stringify(notes)) {
      setLessonData((prev) => ({
        ...prev,
        notesContent: { notes },
      }));
    }
  }, [notes, lessonData]);

  const handleChange = (idx, val) => {
    const updated = [...notes];
    updated[idx] = val;
    setNotes(updated);
  };
  const handleDelete = (idx) => {
    setNotes(notes.filter((_, i) => i !== idx));
  };
  const handleAdd = () => {
    setNotes([...notes, ""]);
  };

  return (
    <Box sx={{ pt: 1 }}>
      {notes.map((note, idx) => (
        <Box
          key={idx}
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <TextField
            fullWidth
            size="small"
            value={note}
            onChange={(e) => handleChange(idx, e.target.value)}
          />
          <IconButton onClick={() => handleDelete(idx)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      <Button variant="outlined" onClick={handleAdd}>
        + Add Note
      </Button>
    </Box>
  );
}
