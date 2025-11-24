import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import healthRouter from './routes/health';
import usersRouter from './routes/users';
import issuesRouter from './routes/issues';
import photosRouter from './routes/photos';
import messagesRouter from './routes/messages';
import complexesRouter from './routes/complexes';
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/users', usersRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/photos', photosRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/complexes', complexesRouter);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Apartment Maintenance Tracker API' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
