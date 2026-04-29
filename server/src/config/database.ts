import { Sequelize } from 'sequelize';
import path from 'path';

// Utilizando SQLite para que guarde en un archivo local sin configuración adicional
const dbPath = path.resolve(__dirname, '../../database.sqlite');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false, // Cambiar a true si quieres ver los logs SQL
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');
    
    // Sincroniza todos los modelos definidos (Crea tablas si no existen)
    await sequelize.sync();
    console.log('Base de datos sincronizada.');
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  }
};
