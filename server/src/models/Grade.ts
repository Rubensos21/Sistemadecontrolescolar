import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { Student } from './Student';

export interface GradeAttributes {
  id?: string;
  alumnoId: string;
  materia: string;
  calificacion: number;
  periodo: string;
}

export class Grade extends Model<GradeAttributes> implements GradeAttributes {
  public id!: string;
  public alumnoId!: string;
  public materia!: string;
  public calificacion!: number;
  public periodo!: string;
}

Grade.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    alumnoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Student,
        key: 'id',
      },
      onDelete: 'CASCADE', // Si se borra el estudiante, se borran sus calificaciones
    },
    materia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    calificacion: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    periodo: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Periodo 1',
    },
  },
  {
    sequelize,
    modelName: 'Grade',
  }
);

// Estableciendo Relaciones
Student.hasMany(Grade, { foreignKey: 'alumnoId', as: 'grades' });
Grade.belongsTo(Student, { foreignKey: 'alumnoId', as: 'student' });
