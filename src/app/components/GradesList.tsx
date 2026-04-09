import { useState, useEffect } from "react";
import { getStudents, getGrades, addGrade, updateGrade, deleteGrade } from "../utils/storage";
import { Student, Grade } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function GradesList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<Grade[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStudent, setFilterStudent] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    alumnoId: "",
    materia: "",
    calificacion: "",
    periodo: "Periodo 1",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = grades;

    if (filterStudent !== "all") {
      filtered = filtered.filter((g) => g.alumnoId === filterStudent);
    }

    if (filterSubject !== "all") {
      filtered = filtered.filter((g) => g.materia === filterSubject);
    }

    if (searchTerm) {
      filtered = filtered.filter((grade) => {
        const student = students.find((s) => s.id === grade.alumnoId);
        const studentName = student
          ? `${student.nombre} ${student.apellido}`.toLowerCase()
          : "";
        return (
          studentName.includes(searchTerm.toLowerCase()) ||
          grade.materia.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredGrades(filtered);
  }, [searchTerm, filterStudent, filterSubject, grades, students]);

  const loadData = () => {
    setStudents(getStudents());
    setGrades(getGrades());
  };

  const subjects = Array.from(new Set(grades.map((g) => g.materia)));

  const resetForm = () => {
    setFormData({
      alumnoId: "",
      materia: "",
      calificacion: "",
      periodo: "Periodo 1",
    });
    setEditingGrade(null);
  };

  const handleOpenDialog = (grade?: Grade) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({
        alumnoId: grade.alumnoId,
        materia: grade.materia,
        calificacion: grade.calificacion.toString(),
        periodo: grade.periodo,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const gradeData = {
      alumnoId: formData.alumnoId,
      materia: formData.materia,
      calificacion: Number(formData.calificacion),
      periodo: formData.periodo,
    };

    if (editingGrade) {
      updateGrade(editingGrade.id, gradeData);
      toast.success("Calificación actualizada correctamente");
    } else {
      addGrade(gradeData);
      toast.success("Calificación agregada correctamente");
    }

    loadData();
    handleCloseDialog();
  };

  const handleDeleteClick = (id: string) => {
    setGradeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (gradeToDelete) {
      deleteGrade(gradeToDelete);
      loadData();
      toast.success("Calificación eliminada correctamente");
      setDeleteDialogOpen(false);
      setGradeToDelete(null);
    }
  };

  const getStudentName = (alumnoId: string) => {
    const student = students.find((s) => s.id === alumnoId);
    return student ? `${student.nombre} ${student.apellido}` : "Desconocido";
  };

  const getStudentGrade = (alumnoId: string) => {
    const student = students.find((s) => s.id === alumnoId);
    return student ? `${student.grado}° ${student.grupo}` : "";
  };

  const calculateAverage = () => {
    if (filteredGrades.length === 0) return 0;
    const sum = filteredGrades.reduce((acc, g) => acc + g.calificacion, 0);
    return (sum / filteredGrades.length).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2">Calificaciones</h2>
          <p className="text-gray-600">Gestión de calificaciones por alumno</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Calificación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGrade ? "Editar Calificación" : "Nueva Calificación"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="alumnoId">Alumno *</Label>
                  <Select
                    value={formData.alumnoId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, alumnoId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar alumno" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.nombre} {student.apellido} - {student.grado}°{" "}
                          {student.grupo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materia">Materia *</Label>
                  <Input
                    id="materia"
                    value={formData.materia}
                    onChange={(e) =>
                      setFormData({ ...formData, materia: e.target.value })
                    }
                    placeholder="Ej: Matemáticas"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calificacion">Calificación *</Label>
                    <Input
                      id="calificacion"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.calificacion}
                      onChange={(e) =>
                        setFormData({ ...formData, calificacion: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="periodo">Periodo *</Label>
                    <Select
                      value={formData.periodo}
                      onValueChange={(value) =>
                        setFormData({ ...formData, periodo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Periodo 1">Periodo 1</SelectItem>
                        <SelectItem value="Periodo 2">Periodo 2</SelectItem>
                        <SelectItem value="Periodo 3">Periodo 3</SelectItem>
                        <SelectItem value="Final">Final</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingGrade ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Calificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{filteredGrades.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Promedio General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{calculateAverage()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Materias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{subjects.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterStudent} onValueChange={setFilterStudent}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por alumno" />
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
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por materia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las materias</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alumno</TableHead>
              <TableHead>Grado</TableHead>
              <TableHead>Materia</TableHead>
              <TableHead>Calificación</TableHead>
              <TableHead>Periodo</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No se encontraron calificaciones
                </TableCell>
              </TableRow>
            ) : (
              filteredGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{getStudentName(grade.alumnoId)}</TableCell>
                  <TableCell>{getStudentGrade(grade.alumnoId)}</TableCell>
                  <TableCell>{grade.materia}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded ${
                        grade.calificacion >= 90
                          ? "bg-green-100 text-green-800"
                          : grade.calificacion >= 80
                          ? "bg-blue-100 text-blue-800"
                          : grade.calificacion >= 70
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {grade.calificacion}
                    </span>
                  </TableCell>
                  <TableCell>{grade.periodo}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(grade)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(grade.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la calificación
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
