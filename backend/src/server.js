import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import ingestRouter from './routes/ingest.js';
import itemsRouter from './routes/items.js';
import queryRouter from './routes/query.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: env.FRONTEND_URL }));
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(JSON.stringify({
      level: 'info',
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start
    }));
  });
  next();
});

app.get(['/health', '/api/health'], (_req, res) => res.json({ status: 'ok' }));
app.use(['/ingest', '/api/ingest'], ingestRouter);
app.use(['/items', '/api/items'], itemsRouter);
app.use(['/query', '/api/query'], queryRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(JSON.stringify({ level: 'info', message: `API listening on http://localhost:${env.PORT}` }));
});
