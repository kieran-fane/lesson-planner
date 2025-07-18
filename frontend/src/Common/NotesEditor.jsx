import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, TextField, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Context from "../appContext";

// Reusable debounce hook
function useDebouncedEffect(callback, deps, delay) {
  useEffect(() => {
    const handler = setTimeout(() => callback(), delay);
    return () => clearTimeout(handler);
  }, [...deps, delay]);
}

export default function NotesEditor() {
  const { lessonData, setLessonData } = useContext(Context);

  const initialNotes = lessonData?.notesContent?.notes?.length
    ? lessonData.notesContent.notes
    : [""];

  const [notes, setNotes] = useState(initialNotes);
  const didMountRef = useRef(false);

  // Reset on lesson switch
  useEffect(() => {
    setNotes(initialNotes);
    didMountRef.current = false;
  }, [lessonData?.id]);

  // Debounced update
  useDebouncedEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const current = lessonData?.notesContent?.notes || [];
    if (JSON.stringify(current) !== JSON.stringify(notes)) {
      setLessonData((prev) => ({
        ...prev,
        notesContent: { notes },
      }));
    }
  }, [notes], 500);

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
        <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
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
