import { Router } from 'express';
import { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } from '../controllers/studentController';
import { validate } from '../middlewares/validate';
import { studentSchema } from '../middlewares/schemas';

const router = Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);

// Usamos el middleware validate() con nuestro studentSchema antes de llegar al controlador
router.post('/', validate(studentSchema), createStudent);
router.put('/:id', validate(studentSchema), updateStudent);
router.delete('/:id', deleteStudent);

export default router;
