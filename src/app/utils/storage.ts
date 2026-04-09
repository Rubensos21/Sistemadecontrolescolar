import { Student, Grade } from "../types";

const STUDENTS_KEY = "school_students";
const GRADES_KEY = "school_grades";

// Initialize with sample data if empty
const initializeData = () => {
  if (!localStorage.getItem(STUDENTS_KEY)) {
    const sampleStudents: Student[] = [
      {
        id: "1",
        matricula: "2024001",
        nombre: "Juan",
        apellido: "García López",
        email: "juan.garcia@escuela.edu",
        fechaNacimiento: "2008-05-15",
        grado: "3",
        grupo: "A",
      },
      {
        id: "2",
        matricula: "2024002",
        nombre: "María",
        apellido: "Rodríguez Martínez",
        email: "maria.rodriguez@escuela.edu",
        fechaNacimiento: "2008-08-22",
        grado: "3",
        grupo: "A",
      },
      {
        id: "3",
        matricula: "2024003",
        nombre: "Carlos",
        apellido: "Hernández Pérez",
        email: "carlos.hernandez@escuela.edu",
        fechaNacimiento: "2008-03-10",
        grado: "3",
        grupo: "B",
      },
      {
        id: "4",
        matricula: "2024004",
        nombre: "Ana",
        apellido: "López Sánchez",
        email: "ana.lopez@escuela.edu",
        fechaNacimiento: "2008-11-30",
        grado: "2",
        grupo: "A",
      },
      {
        id: "5",
        matricula: "2024005",
        nombre: "Pedro",
        apellido: "Martínez González",
        email: "pedro.martinez@escuela.edu",
        fechaNacimiento: "2009-01-18",
        grado: "2",
        grupo: "B",
      },
    ];
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(sampleStudents));
  }

  if (!localStorage.getItem(GRADES_KEY)) {
    const sampleGrades: Grade[] = [
      // Juan García - Grado 3A
      { id: "g1", alumnoId: "1", materia: "Matemáticas", calificacion: 95, periodo: "Periodo 1" },
      { id: "g2", alumnoId: "1", materia: "Español", calificacion: 88, periodo: "Periodo 1" },
      { id: "g3", alumnoId: "1", materia: "Ciencias", calificacion: 92, periodo: "Periodo 1" },
      { id: "g4", alumnoId: "1", materia: "Historia", calificacion: 85, periodo: "Periodo 1" },
      { id: "g5", alumnoId: "1", materia: "Inglés", calificacion: 90, periodo: "Periodo 1" },
      
      // María Rodríguez - Grado 3A
      { id: "g6", alumnoId: "2", materia: "Matemáticas", calificacion: 78, periodo: "Periodo 1" },
      { id: "g7", alumnoId: "2", materia: "Español", calificacion: 92, periodo: "Periodo 1" },
      { id: "g8", alumnoId: "2", materia: "Ciencias", calificacion: 85, periodo: "Periodo 1" },
      { id: "g9", alumnoId: "2", materia: "Historia", calificacion: 90, periodo: "Periodo 1" },
      { id: "g10", alumnoId: "2", materia: "Inglés", calificacion: 88, periodo: "Periodo 1" },
      
      // Carlos Hernández - Grado 3B
      { id: "g11", alumnoId: "3", materia: "Matemáticas", calificacion: 82, periodo: "Periodo 1" },
      { id: "g12", alumnoId: "3", materia: "Español", calificacion: 80, periodo: "Periodo 1" },
      { id: "g13", alumnoId: "3", materia: "Ciencias", calificacion: 88, periodo: "Periodo 1" },
      { id: "g14", alumnoId: "3", materia: "Historia", calificacion: 75, periodo: "Periodo 1" },
      { id: "g15", alumnoId: "3", materia: "Inglés", calificacion: 85, periodo: "Periodo 1" },
      
      // Ana López - Grado 2A
      { id: "g16", alumnoId: "4", materia: "Matemáticas", calificacion: 90, periodo: "Periodo 1" },
      { id: "g17", alumnoId: "4", materia: "Español", calificacion: 95, periodo: "Periodo 1" },
      { id: "g18", alumnoId: "4", materia: "Ciencias", calificacion: 92, periodo: "Periodo 1" },
      { id: "g19", alumnoId: "4", materia: "Historia", calificacion: 88, periodo: "Periodo 1" },
      { id: "g20", alumnoId: "4", materia: "Inglés", calificacion: 93, periodo: "Periodo 1" },
      
      // Pedro Martínez - Grado 2B
      { id: "g21", alumnoId: "5", materia: "Matemáticas", calificacion: 70, periodo: "Periodo 1" },
      { id: "g22", alumnoId: "5", materia: "Español", calificacion: 75, periodo: "Periodo 1" },
      { id: "g23", alumnoId: "5", materia: "Ciencias", calificacion: 72, periodo: "Periodo 1" },
      { id: "g24", alumnoId: "5", materia: "Historia", calificacion: 78, periodo: "Periodo 1" },
      { id: "g25", alumnoId: "5", materia: "Inglés", calificacion: 80, periodo: "Periodo 1" },
    ];
    localStorage.setItem(GRADES_KEY, JSON.stringify(sampleGrades));
  }
};

// Students CRUD
export const getStudents = (): Student[] => {
  initializeData();
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getStudent = (id: string): Student | undefined => {
  const students = getStudents();
  return students.find((s) => s.id === id);
};

export const addStudent = (student: Omit<Student, "id">): Student => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: Date.now().toString(),
  };
  students.push(newStudent);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return newStudent;
};

export const updateStudent = (id: string, student: Partial<Student>): Student | null => {
  const students = getStudents();
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;
  
  students[index] = { ...students[index], ...student };
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return students[index];
};

export const deleteStudent = (id: string): boolean => {
  const students = getStudents();
  const filtered = students.filter((s) => s.id !== id);
  if (filtered.length === students.length) return false;
  
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(filtered));
  
  // Also delete related grades
  const grades = getGrades();
  const filteredGrades = grades.filter((g) => g.alumnoId !== id);
  localStorage.setItem(GRADES_KEY, JSON.stringify(filteredGrades));
  
  return true;
};

// Grades CRUD
export const getGrades = (): Grade[] => {
  initializeData();
  const data = localStorage.getItem(GRADES_KEY);
  return data ? JSON.parse(data) : [];
};

export const getGradesByStudent = (alumnoId: string): Grade[] => {
  const grades = getGrades();
  return grades.filter((g) => g.alumnoId === alumnoId);
};

export const addGrade = (grade: Omit<Grade, "id">): Grade => {
  const grades = getGrades();
  const newGrade: Grade = {
    ...grade,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  };
  grades.push(newGrade);
  localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
  return newGrade;
};

export const addGrades = (newGrades: Omit<Grade, "id">[]): Grade[] => {
  const grades = getGrades();
  const createdGrades: Grade[] = newGrades.map((grade, index) => ({
    ...grade,
    id: (Date.now() + index).toString() + Math.random().toString(36).substr(2, 9),
  }));
  grades.push(...createdGrades);
  localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
  return createdGrades;
};

export const updateGrade = (id: string, grade: Partial<Grade>): Grade | null => {
  const grades = getGrades();
  const index = grades.findIndex((g) => g.id === id);
  if (index === -1) return null;
  
  grades[index] = { ...grades[index], ...grade };
  localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
  return grades[index];
};

export const deleteGrade = (id: string): boolean => {
  const grades = getGrades();
  const filtered = grades.filter((g) => g.id !== id);
  if (filtered.length === grades.length) return false;
  
  localStorage.setItem(GRADES_KEY, JSON.stringify(filtered));
  return true;
};
