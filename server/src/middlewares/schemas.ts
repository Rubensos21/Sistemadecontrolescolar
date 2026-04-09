import { z } from 'zod';

// Esquema para validar la creación o actualización de Estudiantes
export const studentSchema = z.object({
  body: z.object({
    matricula: z.string({ required_error: 'La matrícula es obligatoria' }).min(3, 'La matrícula debe tener al menos 3 caracteres'),
    nombre: z.string({ required_error: 'El nombre es obligatorio' }).min(2, 'El nombre es muy corto'),
    apellido: z.string({ required_error: 'El apellido es obligatorio' }),
    email: z.string({ required_error: 'El email es obligatorio' }).email('Formato de email inválido'),
    fechaNacimiento: z.string({ required_error: 'La fecha de nacimiento es obligatoria' }),
    grado: z.string({ required_error: 'El grado es obligatorio' }),
    grupo: z.string({ required_error: 'El grupo es obligatorio' })
  })
});

// Esquema para validar Calificaciones (Una o Múltiples importaciones)
export const gradeSchema = z.object({
  body: z.object({
    alumnoId: z.string({ required_error: 'El ID del alumno es obligatorio' }).uuid('Debe ser un UUID válido'),
    materia: z.string({ required_error: 'La materia es obligatoria' }),
    calificacion: z.number({ required_error: 'La calificación es obligatoria' }).min(0, 'La calificación mínima es 0').max(100, 'La calificación máxima es 100'),
    periodo: z.string().optional()
  })
});
