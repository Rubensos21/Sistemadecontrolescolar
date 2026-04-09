import { Request, Response, NextFunction } from 'express';
import { Student } from '../models/Student';
import { Grade } from '../models/Grade';

export const getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await Student.findAll();
    res.status(200).json({ status: 'success', data: students });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await Student.findByPk(req.params.id as string, {
      include: [{ model: Grade, as: 'grades' }] // Traerá las notas asociadas
    });
    
    if (!student) {
      return res.status(404).json({ status: 'error', message: 'Alumno no encontrado' });
    }
    
    res.status(200).json({ status: 'success', data: student });
  } catch (error) {
    next(error);
  }
};

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // La validación por Zod asegura que req.body viene limpio y correcto
    const { email, matricula } = req.body;

    // Chequeo de duplicados
    const existing = await Student.findOne({ where: { matricula } });
    if (existing) return res.status(409).json({ status: 'error', message: 'La matrícula ya existe' });

    const newStudent = await Student.create(req.body);
    res.status(201).json({ status: 'success', data: newStudent });
  } catch (error) {
    next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await Student.findByPk(req.params.id as string);
    if (!student) return res.status(404).json({ status: 'error', message: 'Alumno no encontrado' });

    await student.update(req.body);
    res.status(200).json({ status: 'success', data: student });
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await Student.findByPk(req.params.id as string);
    if (!student) return res.status(404).json({ status: 'error', message: 'Alumno no encontrado' });

    await student.destroy();
    res.status(200).json({ status: 'success', message: 'Alumno eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};
