import { useState, useEffect } from "react";
import { read, utils, writeFile } from "xlsx";
import { getStudents, addGrades } from "../utils/storage";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import { Grade } from "../types";

interface ExcelRow {
  Matricula?: string;
  Materia?: string;
  Calificacion?: number;
  Periodo?: string;
  [key: string]: string | number | undefined;
}

export function ImportGrades() {
  const [previewData, setPreviewData] = useState<ExcelRow[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<{
    valid: number;
    invalid: number;
    errors: string[];
  }>({ valid: 0, invalid: 0, errors: [] });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    getStudents().then(setStudents).catch(console.error);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const data = event.target?.result;
        const workbook = read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        let jsonData: ExcelRow[] = utils.sheet_to_json(sheet);
        jsonData = jsonData.filter((row) => {
          const matricula = row.Matricula?.toString().trim();
          const materia = row.Materia?.toString().trim();
          const periodo = row.Periodo?.toString().trim();
          const calcString = row.Calificacion !== undefined ? String(row.Calificacion).trim() : "";
          return !!(matricula || materia || periodo || calcString !== "");
        });

        const currentStudents = await getStudents();
        setPreviewData(jsonData);
        validateData(jsonData, currentStudents);
        toast.success("Archivo cargado correctamente");
      } catch (error) {
        toast.error("Error al leer el archivo");
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const validateData = (data: ExcelRow[], students: any[]) => {
    const errors: string[] = [];
    let validCount = 0;
    let invalidCount = 0;

    data.forEach((row, index) => {
      const rowNum = index + 2; // Excel rows start at 1, header is row 1

      // Check required fields
      if (!row.Matricula) {
        errors.push(`Fila ${rowNum}: Falta la matrícula`);
        invalidCount++;
        return;
      }

      if (!row.Materia) {
        errors.push(`Fila ${rowNum}: Falta la materia`);
        invalidCount++;
        return;
      }

      if (row.Calificacion === undefined || row.Calificacion === null) {
        errors.push(`Fila ${rowNum}: Falta la calificación`);
        invalidCount++;
        return;
      }

      // Validate grade range
      if (row.Calificacion < 0 || row.Calificacion > 100) {
        errors.push(`Fila ${rowNum}: Calificación fuera de rango (0-100)`);
        invalidCount++;
        return;
      }

      // Check if student exists
      const student = students.find((s) => s.matricula === row.Matricula);
      if (!student) {
        errors.push(`Fila ${rowNum}: Alumno con matrícula ${row.Matricula} no encontrado`);
        invalidCount++;
        return;
      }

      validCount++;
    });

    setValidationResults({ valid: validCount, invalid: invalidCount, errors });
  };

  const handleImport = async () => {
    if (validationResults.valid === 0) {
      toast.error("No hay datos válidos para importar");
      return;
    }

    try {
      const currentStudents = await getStudents();
      const gradesToImport: Omit<Grade, "id">[] = [];

      previewData.forEach((row) => {
        const student = currentStudents.find((s) => s.matricula === row.Matricula);
        if (
          student &&
          row.Materia &&
          row.Calificacion !== undefined &&
          row.Calificacion >= 0 &&
          row.Calificacion <= 100
        ) {
          gradesToImport.push({
            alumnoId: student.id,
            materia: row.Materia,
            calificacion: Number(row.Calificacion),
            periodo: row.Periodo || "Periodo 1",
          });
        }
      });

      await addGrades(gradesToImport);
      toast.success(`${gradesToImport.length} calificaciones importadas correctamente`);
      
      // Reset
      setPreviewData([]);
      setValidationResults({ valid: 0, invalid: 0, errors: [] });
    } catch (error: any) {
      toast.error(error.message || "Error al importar calificaciones");
    }
  };

  const downloadTemplate = () => {
    const ws = utils.aoa_to_sheet([
      ["Matricula", "Materia", "Calificacion", "Periodo"], // Encabezados requeridos
    ]);
    
    for (let R = 1; R <= 1000; R++) {
      ws[utils.encode_cell({ r: R, c: 0 })] = { t: "s", v: "", z: "@" };
      ws[utils.encode_cell({ r: R, c: 1 })] = { t: "s", v: "", z: "@" };
      ws[utils.encode_cell({ r: R, c: 3 })] = { t: "s", v: "", z: "@" };
    }
    ws["!ref"] = utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 3, r: 1000} });

    ws["!cols"] = [
      { wch: 15 }, // Matricula
      { wch: 30 }, // Materia
      { wch: 15 }, // Calificacion
      { wch: 15 }  // Periodo
    ];

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Calificaciones");

    // Generar descarga directa con writeFile
    writeFile(wb, "plantilla.xlsx");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Importar Calificaciones</h2>
        <p className="text-gray-600">Carga calificaciones desde un archivo Excel</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle>Subir Archivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Selecciona un archivo Excel (.xlsx, .xls)</Label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="file"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Haz clic para seleccionar un archivo
                  </span>
                  <input
                    id="file"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isProcessing}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={downloadTemplate}
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar Plantilla
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Descarga la plantilla de Excel con el formato correcto
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="mb-1">
                    El archivo debe contener las siguientes columnas:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                    <li>
                      <strong>Matricula:</strong> Matrícula del alumno
                    </li>
                    <li>
                      <strong>Materia:</strong> Nombre de la materia
                    </li>
                    <li>
                      <strong>Calificacion:</strong> Calificación (0-100)
                    </li>
                    <li>
                      <strong>Periodo:</strong> Periodo académico (opcional)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-600">
                    Asegúrate de que las matrículas de los alumnos coincidan con
                    los registros en el sistema.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Results */}
      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Validación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total registros</p>
                  <p className="text-2xl">{previewData.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Válidos</p>
                  <p className="text-2xl">{validationResults.valid}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Inválidos</p>
                  <p className="text-2xl">{validationResults.invalid}</p>
                </div>
              </div>
            </div>

            {validationResults.errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="mb-2 text-red-800">Errores encontrados:</h4>
                <ul className="text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                  {validationResults.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPreviewData([]);
                  setValidationResults({ valid: 0, invalid: 0, errors: [] });
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={validationResults.valid === 0}
              >
                Importar {validationResults.valid} Calificaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Table */}
      {previewData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa de Datos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Materia</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 10).map((row, index) => {
                    const student = students.find(
                      (s) => s.matricula === row.Matricula
                    );
                    const isValid =
                      student &&
                      row.Materia &&
                      row.Calificacion !== undefined &&
                      row.Calificacion >= 0 &&
                      row.Calificacion <= 100;

                    return (
                      <TableRow key={index}>
                        <TableCell>{row.Matricula || "-"}</TableCell>
                        <TableCell>{row.Materia || "-"}</TableCell>
                        <TableCell>{row.Calificacion ?? "-"}</TableCell>
                        <TableCell>{row.Periodo || "Periodo 1"}</TableCell>
                        <TableCell>
                          {isValid ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Válido
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-600">
                              <AlertCircle className="w-4 h-4" />
                              Inválido
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {previewData.length > 10 && (
                <div className="p-4 text-center text-sm text-gray-500 border-t">
                  Mostrando 10 de {previewData.length} registros
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
