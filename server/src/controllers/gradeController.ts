import { Request, Response, NextFunction } from 'express';
import { Grade } from '../models/Grade';
import { Student } from '../models/Student';

export const getGrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Si envían un query ?alumnoId=123 , filtramos. Si no, devolvemos todo.
    const whereClause = req.query.alumnoId ? { alumnoId: req.query.alumnoId as string } : {};
    
    const grades = await Grade.findAll({ where: whereClause });
    res.status(200).json({ status: 'success', data: grades });
  } catch (error) {
    next(error);
  }
};

export const createGrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { alumnoId } = req.body;

    // Verificar si el alumno existe antes de asignar nota
    const student = await Student.findByPk(alumnoId);
    if (!student) {
      return res.status(404).json({ status: 'error', message: 'No se encontró al alumno para asignar calificación' });
    }

    const newGrade = await Grade.create(req.body);
    res.status(201).json({ status: 'success', data: newGrade });
  } catch (error) {
    next(error);
  }
};

// Crear múltiples calificaciones simultáneamente (Importación Excel)
export const createBulkGrades = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gradesData = req.body; // Debería ser un array
    if (!Array.isArray(gradesData)) {
      return res.status(400).json({ status: 'error', message: 'El body debe ser un arreglo de calificaciones' });
    }

    const newGrades = await Grade.bulkCreate(gradesData);
    res.status(201).json({ status: 'success', data: newGrades });
  } catch (error) {
    next(error);
  }
};

export const updateGrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const grade = await Grade.findByPk(req.params.id as string);
    if (!grade) return res.status(404).json({ status: 'error', message: 'Calificación no encontrada' });

    await grade.update(req.body);
    res.status(200).json({ status: 'success', data: grade });
  } catch (error) {
    next(error);
  }
};

export const deleteGrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const grade = await Grade.findByPk(req.params.id as string);
    if (!grade) return res.status(404).json({ status: 'error', message: 'Calificación no encontrada' });

    await grade.destroy();
    res.status(200).json({ status: 'success', message: 'Calificación eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};
