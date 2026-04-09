import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export interface StudentAttributes {
  id?: string;
  matricula: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
  grado: string;
  grupo: string;
}

export class Student extends Model<StudentAttributes> implements StudentAttributes {
  public id!: string;
  public matricula!: string;
  public nombre!: string;
  public apellido!: string;
  public email!: string;
  public fechaNacimiento!: string;
  public grado!: string;
  public grupo!: string;
}

Student.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matricula: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fechaNacimiento: {
      type: DataTypes.STRING, // o DATEONLY pero STRING encaja con tu frontend temporalmente
      allowNull: false,
    },
    grado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    grupo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Student',
  }
);
