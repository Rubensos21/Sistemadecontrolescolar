import { Router } from 'express';
import { getGrades, createGrade, createBulkGrades, updateGrade, deleteGrade } from '../controllers/gradeController';
import { validate } from '../middlewares/validate';
import { gradeSchema } from '../middlewares/schemas';
import { z } from 'zod';

const router = Router();

router.get('/', getGrades);
router.post('/', validate(gradeSchema), createGrade);

// Para importación masiva usamos z.array del esquema base de body
router.post('/bulk', validate(z.object({ body: z.array(gradeSchema.shape.body) })), createBulkGrades);

router.put('/:id', validate(gradeSchema), updateGrade);
router.delete('/:id', deleteGrade);

export default router;
