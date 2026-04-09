import app from './src/app';
import { connectDB } from './src/config/database';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  // Conectar a Base de Datos (y crear el archivo local SQLite)
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo de forma segura en: http://localhost:${PORT}`);
  });
};

startServer();
