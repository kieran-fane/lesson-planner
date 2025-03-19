import * as db from './db.js';

/**
 * Adds a lesson to the database
 * @param {object} req request
 * @param {object} res response 
 */
export async function add(req, res) {
  const {name, videoId, transcript,
    lessonPlanContent, quizContent, notesContent} = req.body;
  const lessonId = await db.addLesson(name, videoId, transcript,
    lessonPlanContent, quizContent, notesContent);
  res.status(201).json({success: true, lessonId});
}

/**
 * Gets a list of lessons
 * @param {object} req request
 * @param {object} res response 
 */
export async function getAll(req, res) {
  const lessons = await db.getLessons();
  res.status(201).json({success: true, lessons});
}

/**
 * Gets a single lesson by ID
 * @param {object} req request
 * @param {object} res response 
 */
export async function getLesson(req, res) {
  try {
    const lesson = await db.getLessonById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    res.json({ success: true, lesson });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
