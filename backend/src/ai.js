import OpenAI from 'openai';
import { z } from 'zod';
import { zodResponseFormat } from 'openai/helpers/zod';
// import { getLessonById } from './db.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Zod Schemas
const lessonPlanSchema = z.object({
  title: z.string(),
  objectives: z.array(z.string()),
  summary: z.string(),
  activities: z.array(z.string()),
});

const quizSchema = z.object({
  questions: z.array(
    z.object({
      question: z.string(),
      choices: z.array(z.string()).length(4),
      answer: z.string(),
    })
  ),
});

const notesSchema = z.object({
  notes: z.array(z.string()),
});

const lessonSchema = z.object({
  lessonPlan: lessonPlanSchema, 
  quiz: quizSchema, 
  notes: notesSchema
});

function getNewGenPrompt(transcript) {
  const newGenPrompt = `Generate a lesson, that will be comprized of 3 things, a lesson plan, a quiz, and fill-in-the-blank notes. 
  Using the transcript below.
  Retrun ONLY valid JSON with the following schema:\n\n 
  lesson : {\n
    lessonPlan: {title, objectives
        (array), summary, activities (array)},\n
    quiz: [{ question, choices (4), answer }],\n
    notes: [ strings with '____' blanks about key ideas. ],\n
  }\n\n
  Transcript:\n${transcript}
  `;
  return newGenPrompt;
}

function getPrompt(tab, transcript) {
  switch (tab) {
    case 'lessonPlan':
      return `Generate a lesson plan based on the transcript below. 
        Return ONLY valid JSON matching this schema: title, objectives
        (array), summary, activities (array).\n\nTranscript:\n${transcript}`;
    case 'quiz':
      return `Generate a multiple-choice quiz (5+ questions) from the transcript below. 
      Return ONLY valid JSON matching this schema: [{ question, choices (4), answer }].
      \n\nTranscript:\n${transcript}`;
    case 'notes':
      return `Generate fill-in-the-blank notes from the transcript below. 
      Return ONLY valid JSON matching this schema: [ strings with '____' blanks about key ideas. ]
      \n\nTranscript:\n${transcript}`;
    default:
      return null;
  }
}

function getSchema(tab) {
  switch (tab) {
    case 'lessonPlan': return lessonPlanSchema;
    case 'quiz': return quizSchema;
    case 'notes': return notesSchema;
    default: return null;
  }
}

export async function generateNewLesson(req, res) {
  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({error: 'transcript is required'})
  }

  const lessonWrapper = z.object({ lesson: lessonSchema });
  const responseFormat = zodResponseFormat(lessonWrapper, "lesson");
  try {
    const completion = await openai.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content: `You are an educational assistant that returns ONLY structured JSON for a newly created lesson object.`,
        },
        {
          role: 'user',
          content: getNewGenPrompt(transcript),
        },
      ],
      response_format: responseFormat,
    });
    const parsed = completion.choices[0].message.parsed;
    return res.status(201).json({ success: true, content: parsed });
  } catch (err) {
    console.error('OpenAI parse error:', err);
    return res.status(500).json({ error: 'Failed to generate content', details: err.message });
  }
}

export async function generateLessonItem(req, res) {
  const { transcript, requestType } = req.body;

  if (!transcript || !requestType) {
    return res.status(400).json({ error: "transcript and tab are required" });
  }

  // const lesson = await getLessonById(lessonID);
  
//   if (!lesson || !lesson.data?.transcript) {
//     console.log('no Transcript');
//     return res.status(404).json({ error: "Transcript not found for lesson" });
//   }

  const prompt = getPrompt(requestType, transcript);
  const schema = getSchema(requestType);

  if (!prompt || !schema) {
    return res.status(400).json({ error: "Invalid tab type" });
  }

  try {
    const response = await openai.responses.parse({
      model: 'gpt-4o-2024-08-06',
      input: [
        {
          role: 'system',
          content: `You are an educational assistant that returns ONLY structured JSON for tab type: ${requestType}`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      text: {
        format: zodTextFormat(schema, requestType),
      },
    });
    return res.status(201).json({ success: true, requestType, content: response.output_parsed });
  } catch (err) {
    console.error('OpenAI parse error:', err);
    return res.status(500).json({ error: 'Failed to generate content', details: err.message });
  }
}
