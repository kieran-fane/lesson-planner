import 'dotenv/config';
import app from './app.js';

app.listen(3010, () => {
  console.log('Lesson-Planner AI Backend Running');
  console.log('API Testing UI is at: http://localhost:3010/api/v0/docs/');
});
