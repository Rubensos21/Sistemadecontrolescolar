import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRouter from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Middlewares de seguridad y parsing
app.use(helmet());
app.use(cors());
app.use(express.json());

// Main Rutas -> todas partirán desde http://localhost:3000/api/v1
app.use('/api/v1', apiRouter);

// Handler global de errores (Debe ir siempre después de las rutas)
app.use(errorHandler);

export default app;
