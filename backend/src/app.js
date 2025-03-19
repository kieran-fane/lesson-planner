import express from 'express';
import cors from 'cors';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'node:path';
import OpenApiValidator from 'express-openapi-validator';
import {fileURLToPath} from 'node:url';
import multer from 'multer';

import {uploadVideo} from './upload.js';
import * as lesson from './lesson.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '500mb' }));  
app.use(express.urlencoded({ extended: false, limit: '500mb' }));

const upload = multer({
  limits: {
    fieldSize: 100 * 1024 * 1024, // Allow large fields (100MB)
    fileSize: 500 * 1024 * 1024, // Allow large file sizes (500MB)
    parts: 100,
  }, // Allow 500MB files
  dest: 'uploads/',
});

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/api/v0/docs', swaggerUi.serve, swaggerUi.setup(apidoc));

// Allow connections from a non common origin so the UI can connect
app.use(cors({origin: 'http://localhost:3000'}));

app.post('/api/v0/upload', upload.single('video'), uploadVideo);
app.post('/api/v0/lesson', lesson.add);
app.get('/api/v0/lesson', lesson.getAll);
app.get('/api/v0/lesson/:id', lesson.getLesson);

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    code: err.status || 500,
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

export default app;
