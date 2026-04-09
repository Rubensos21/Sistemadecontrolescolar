import { useEffect, useState } from "react";
import { getStudents, getGrades } from "../utils/storage";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, BookOpen, Award, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Student, Grade } from "../types";

export function DashboardHome() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    async function load() {
      const [studentsData, gradesData] = await Promise.all([
        getStudents(),
        getGrades()
      ]);
      setStudents(studentsData);
      setGrades(gradesData);
    }
    load();
  }, []);

  const totalStudents = students.length;
  const totalGrades = grades.length;
  const averageGrade = grades.length > 0 
    ? (grades.reduce((sum, g) => sum + g.calificacion, 0) / grades.length).toFixed(1)
    : 0;

  // Students by grade
  const studentsByGrade = students.reduce((acc, student) => {
    const grade = `${student.grado}° ${student.grupo}`;
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gradeData = Object.entries(studentsByGrade).map(([name, value]) => ({
    name,
    estudiantes: value,
  }));

  // Average by subject
  const gradesBySubject = grades.reduce((acc, grade) => {
    if (!acc[grade.materia]) {
      acc[grade.materia] = { total: 0, count: 0 };
    }
    acc[grade.materia].total += grade.calificacion;
    acc[grade.materia].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const subjectData = Object.entries(gradesBySubject).map(([name, data]) => ({
    name,
    promedio: Number((data.total / data.count).toFixed(1)),
  }));

  // Grade distribution
  const gradeRanges = [
    { name: "90-100", count: 0, color: "#22c55e" },
    { name: "80-89", count: 0, color: "#3b82f6" },
    { name: "70-79", count: 0, color: "#f59e0b" },
    { name: "0-69", count: 0, color: "#ef4444" },
  ];

  grades.forEach((grade) => {
    if (grade.calificacion >= 90) gradeRanges[0].count++;
    else if (grade.calificacion >= 80) gradeRanges[1].count++;
    else if (grade.calificacion >= 70) gradeRanges[2].count++;
    else gradeRanges[3].count++;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Dashboard</h2>
        <p className="text-gray-600">Resumen general del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Alumnos</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{totalStudents}</div>
            <p className="text-xs text-gray-600 mt-1">
              Activos en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Calificaciones</CardTitle>
            <BookOpen className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{totalGrades}</div>
            <p className="text-xs text-gray-600 mt-1">
              Registros totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Promedio General</CardTitle>
            <Award className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">{averageGrade}</div>
            <p className="text-xs text-gray-600 mt-1">
              Todas las materias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Rendimiento</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl">
              {grades.filter(g => g.calificacion >= 80).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Calificaciones ≥ 80
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alumnos por Grado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="estudiantes" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeRanges}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {gradeRanges.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Averages */}
      <Card>
        <CardHeader>
          <CardTitle>Promedio por Materia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="promedio" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
