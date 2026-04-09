export interface Student {
  id: string;
  matricula: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  grado: string;
  grupo: string;
}

export interface Grade {
  id: string;
  alumnoId: string;
  materia: string;
  calificacion: number;
  periodo: string;
}

export interface Subject {
  nombre: string;
  promedio: number;
}
