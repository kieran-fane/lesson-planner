import pg from 'pg';

const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export async function saveVideo(metadata, videoBuffer) {
  const data = {
    metadata,
    video: videoBuffer.toString('base64'),
    transcript: null
  };

  const query = {
    text: `INSERT INTO video (data) VALUES ($1) RETURNING id::TEXT`,
    values: [data],
  };

  const {rows} = await pool.query(query);
  return rows[0].id;
}

export async function updateVideoWithTranscript(videoId, transcript) {
  const query = {
    text: `UPDATE video SET data = jsonb_set(data, 
    '{transcript}', to_jsonb($2::TEXT)) WHERE id = $1`,
    values: [videoId, transcript],
  };

  await pool.query(query);
}

export async function addLesson(name, videoId, transcript, lessonPlan, quiz, notes) {
  const lessonData = {
    name,
    transcript,
    lessonPlan,
    quiz,
    notes
  };

  console.log('db: ', lessonData);

  const query = {
    text: `INSERT INTO lesson (video_id, data) VALUES ($1, $2) RETURNING id`,
    values: [videoId, lessonData],
  };

  const {rows} = await pool.query(query);
  return rows[0].id;
}

export async function getLessons() {
  const query = `SELECT id, video_id, data FROM lesson ORDER BY created DESC`;
  const {rows} = await pool.query(query);
  return rows;
}

export async function getLessonById(lessonId) {
  const query = {
    text: `SELECT id, video_id, data FROM lesson WHERE id = $1`,
    values: [lessonId],
  };

  const { rows } = await pool.query(query);
  return rows.length ? rows[0] : null;
}
