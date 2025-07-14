import OpenAI from 'openai';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';
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

export async function generateLessonItems(req, res) {
  console.log(req.body);
  
  const { transcript, requestType } = req.body;

  if (!transcript || !requestType) {
    console.log('no lessonID');
    return res.status(400).json({ error: "lessonID and tab are required" });
  }

  // const lesson = await getLessonById(lessonID);
  
//   if (!lesson || !lesson.data?.transcript) {
//     console.log('no Transcript');
//     return res.status(404).json({ error: "Transcript not found for lesson" });
//   }

  const prompt = getPrompt(requestType, transcript);
  const schema = getSchema(requestType);

  if (!prompt || !schema) {
    console.log('wrong schema type');
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
    console.log(response.output_parsed);
    return res.json({ success: true, requestType, content: response.output_parsed });
  } catch (err) {
    console.error('OpenAI parse error:', err);
    return res.status(500).json({ error: 'Failed to generate content', details: err.message });
  }
}
