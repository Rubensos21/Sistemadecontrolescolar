import { Router } from 'express';
import studentRoutes from './studentRoutes';
import gradeRoutes from './gradeRoutes';

const apiRouter = Router();

apiRouter.use('/students', studentRoutes);
apiRouter.use('/grades', gradeRoutes);

export default apiRouter;
