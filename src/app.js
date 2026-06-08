import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profile.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { NotFoundError } from './utils/errors.js';
import cors from 'cors';

const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', profileRoutes);

app.use((req, res, next) => next(new NotFoundError(`Route ${req.originalUrl} not found`)));
app.use(errorHandler);

export default app;
