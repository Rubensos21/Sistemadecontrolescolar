import { useState, useEffect } from "react";
import { getStudents, getGrades } from "../utils/storage";
import { Student, Grade } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { FileText, TrendingDown, TrendingUp } from "lucide-react";

export function Reports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

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

  const filterGrades = () => {
    let filtered = grades;

    if (selectedStudent !== "all") {
      filtered = filtered.filter((g) => g.alumnoId === selectedStudent);
    }

    if (selectedGrade !== "all") {
      const student = students.find((s) => s.id === selectedStudent);
      if (student) {
        filtered = filtered.filter((g) => {
          const gradeStudent = students.find((s) => s.id === g.alumnoId);
          return gradeStudent?.grado === selectedGrade;
        });
      } else {
        filtered = filtered.filter((g) => {
          const gradeStudent = students.find((s) => s.id === g.alumnoId);
          return gradeStudent?.grado === selectedGrade;
        });
      }
    }

    return filtered;
  };

  const filteredGrades = filterGrades();

  // Student performance
  const studentPerformance = students.map((student) => {
    const studentGrades = grades.filter((g) => g.alumnoId === student.id);
    const average =
      studentGrades.length > 0
        ? studentGrades.reduce((sum, g) => sum + g.calificacion, 0) /
          studentGrades.length
        : 0;

    return {
      nombre: `${student.nombre} ${student.apellido}`,
      promedio: Number(average.toFixed(1)),
      grado: student.grado,
      grupo: student.grupo,
      total: studentGrades.length,
    };
  });

  // Top students
  const topStudents = [...studentPerformance]
    .sort((a, b) => b.promedio - a.promedio)
    .slice(0, 5);

  // Students at risk (below 70)
  const studentsAtRisk = studentPerformance.filter((s) => s.promedio < 70 && s.promedio > 0);

  // Subject performance
  const subjectPerformance: Record<string, { total: number; count: number }> = {};
  filteredGrades.forEach((grade) => {
    if (!subjectPerformance[grade.materia]) {
      subjectPerformance[grade.materia] = { total: 0, count: 0 };
    }
    subjectPerformance[grade.materia].total += grade.calificacion;
    subjectPerformance[grade.materia].count += 1;
  });

  const subjectData = Object.entries(subjectPerformance).map(([name, data]) => ({
    materia: name,
    promedio: Number((data.total / data.count).toFixed(1)),
    total: data.count,
  }));

  // Grade level performance
  const gradeLevelPerformance: Record<string, { total: number; count: number }> = {};
  students.forEach((student) => {
    const studentGrades = grades.filter((g) => g.alumnoId === student.id);
    const key = `${student.grado}° ${student.grupo}`;
    
    if (!gradeLevelPerformance[key]) {
      gradeLevelPerformance[key] = { total: 0, count: 0 };
    }
    
    studentGrades.forEach((grade) => {
      gradeLevelPerformance[key].total += grade.calificacion;
      gradeLevelPerformance[key].count += 1;
    });
  });

  const gradeLevelData = Object.entries(gradeLevelPerformance).map(([name, data]) => ({
    grado: name,
    promedio: Number((data.total / data.count).toFixed(1)),
  }));

  // Performance trend by period
  const periodPerformance: Record<string, { total: number; count: number }> = {};
  filteredGrades.forEach((grade) => {
    if (!periodPerformance[grade.periodo]) {
      periodPerformance[grade.periodo] = { total: 0, count: 0 };
    }
    periodPerformance[grade.periodo].total += grade.calificacion;
    periodPerformance[grade.periodo].count += 1;
  });

  const periodData = Object.entries(periodPerformance).map(([name, data]) => ({
    periodo: name,
    promedio: Number((data.total / data.count).toFixed(1)),
  }));

  const uniqueGrades = Array.from(new Set(students.map((s) => s.grado))).sort();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Reportes y Análisis</h2>
        <p className="text-gray-600">Visualiza el rendimiento académico</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm mb-2 block">Alumno</label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los alumnos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los alumnos</SelectItem>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.nombre} {student.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Grado</label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los grados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grados</SelectItem>
                  {uniqueGrades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}° Grado
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Students & At Risk */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top 5 Mejores Estudiantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumno</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topStudents.map((student, index) => (
                  <TableRow key={index}>
                    <TableCell>{student.nombre}</TableCell>
                    <TableCell>
                      {student.grado}° {student.grupo}
                    </TableCell>
                    <TableCell>
                      <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800">
                        {student.promedio}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              Estudiantes en Riesgo (&lt; 70)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentsAtRisk.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No hay estudiantes en riesgo
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Grado</TableHead>
                    <TableHead>Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsAtRisk.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.nombre}</TableCell>
                      <TableCell>
                        {student.grado}° {student.grupo}
                      </TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-800">
                          {student.promedio}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Materia</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="materia" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="promedio" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Grado</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grado" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="promedio" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencia por Periodo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={periodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="promedio" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reporte Detallado por Alumno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumno</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Total Calificaciones</TableHead>
                  <TableHead>Promedio</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentPerformance
                  .filter((s) => s.total > 0)
                  .sort((a, b) => b.promedio - a.promedio)
                  .map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.nombre}</TableCell>
                      <TableCell>
                        {student.grado}° {student.grupo}
                      </TableCell>
                      <TableCell>{student.total}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 rounded ${
                            student.promedio >= 90
                              ? "bg-green-100 text-green-800"
                              : student.promedio >= 80
                              ? "bg-blue-100 text-blue-800"
                              : student.promedio >= 70
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.promedio}
                        </span>
                      </TableCell>
                      <TableCell>
                        {student.promedio >= 80 ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            Excelente
                          </span>
                        ) : student.promedio >= 70 ? (
                          <span className="text-yellow-600">Regular</span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            En riesgo
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
