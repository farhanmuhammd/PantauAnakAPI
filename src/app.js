import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import teacherProfileRoutes from './routes/teacher_profile.routes.js';
import parentProfileRoutes from './routes/parent_profile.routes.js';
import classRoutes from './routes/class.routes.js';
import trackingRoutes from './routes/tracking.routes.js';
import kidsJournalRoutes from './routes/kids_journal.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { NotFoundError } from './utils/errors.js';
import cors from 'cors';
import { startPickupJob } from './services/pickup.job.js';

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', teacherProfileRoutes);
app.use('/api', parentProfileRoutes);
app.use('/api', classRoutes);
app.use('/api', trackingRoutes);
app.use('/api', kidsJournalRoutes);

app.use((req, res, next) => next(new NotFoundError(`Route ${req.originalUrl} not found`)));
app.use(errorHandler);

startPickupJob();

export default app;
