import { Student, Grade } from "../types";

const API_URL = "http://localhost:3000/api/v1";

// Students CRUD
export const getStudents = async (): Promise<Student[]> => {
  const res = await fetch(`${API_URL}/students`);
  const json = await res.json();
  return json.data || [];
};

export const getStudent = async (id: string): Promise<Student | undefined> => {
  const res = await fetch(`${API_URL}/students/${id}`);
  const json = await res.json();
  return json.data;
};

export const addStudent = async (student: Omit<Student, "id">): Promise<Student> => {
  const res = await fetch(`${API_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error al agregar alumno');
  }
  const json = await res.json();
  return json.data;
};

export const updateStudent = async (id: string, student: Partial<Student>): Promise<Student | null> => {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  const json = await res.json();
  return json.data || null;
};

export const deleteStudent = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/students/${id}`, { method: "DELETE" });
  return res.ok;
};

// Grades CRUD
export const getGrades = async (): Promise<Grade[]> => {
  const res = await fetch(`${API_URL}/grades`);
  const json = await res.json();
  return json.data || [];
};

export const getGradesByStudent = async (alumnoId: string): Promise<Grade[]> => {
  const res = await fetch(`${API_URL}/grades?alumnoId=${alumnoId}`);
  const json = await res.json();
  return json.data || [];
};

export const addGrade = async (grade: Omit<Grade, "id">): Promise<Grade> => {
  const res = await fetch(`${API_URL}/grades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(grade),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error al agregar calificación');
  }
  const json = await res.json();
  return json.data;
};

export const addGrades = async (newGrades: Omit<Grade, "id">[]): Promise<Grade[]> => {
  const res = await fetch(`${API_URL}/grades/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newGrades),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Error en importación masiva');
  }
  const json = await res.json();
  return json.data;
};

export const updateGrade = async (id: string, grade: Partial<Grade>): Promise<Grade | null> => {
  const res = await fetch(`${API_URL}/grades/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(grade),
  });
  const json = await res.json();
  return json.data || null;
};

export const deleteGrade = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/grades/${id}`, { method: "DELETE" });
  return res.ok;
};
