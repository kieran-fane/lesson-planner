import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, TextField, IconButton, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Context from "../appContext";

export default function QuizEditor() {
  const { lessonData, setLessonData } = useContext(Context);

  const aiQs = lessonData?.quizContent?.questions || [];
  const initialQs = aiQs.length > 0
    ? aiQs
    : [{ question: "", choices: ["", "", "", ""], answer: "" }];

  const [questions, setQuestions] = useState(initialQs);
  const didMountRef = useRef(false);

  useEffect(() => {
    setQuestions(initialQs);
  }, [initialQs]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    const current = lessonData?.quizContent?.questions;
    if (!current || JSON.stringify(current) !== JSON.stringify(questions)) {
      setLessonData((prev) => ({
        ...prev,
        quizContent: { questions },
      }));
    }
  }, [questions, lessonData]);

  const handleChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const handleDelete = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleAdd = () => {
    // default new question structure
    setQuestions([
      ...questions,
      { question: "", choices: ["", "", "", ""], answer: "" },
    ]);
  };

  return (
    <Box sx={{ pt: 1 }}>
      {questions.map((q, idx) => (
        <Box
          key={idx}
          sx={{ border: "1px solid #ccc", p: 2, mb: 2, borderRadius: 1 }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1">Question {idx + 1}</Typography>
            <IconButton onClick={() => handleDelete(idx)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Question"
            value={q.question}
            onChange={(e) => handleChange(idx, "question", e.target.value)}
            sx={{ mt: 1, mb: 2 }}
          />

          {q.choices.map((choice, cidx) => (
            <TextField
              key={cidx}
              fullWidth
              label={`Choice ${cidx + 1}`}
              value={choice}
              onChange={(e) => {
                const newChoices = [...q.choices];
                newChoices[cidx] = e.target.value;
                handleChange(idx, "choices", newChoices);
              }}
              sx={{ mb: 1 }}
            />
          ))}

          <TextField
            fullWidth
            label="Correct Answer"
            value={q.answer}
            onChange={(e) => handleChange(idx, "answer", e.target.value)}
            sx={{ mt: 1 }}
          />
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAdd}>
        + Add Question
      </Button>
    </Box>
  );
}
