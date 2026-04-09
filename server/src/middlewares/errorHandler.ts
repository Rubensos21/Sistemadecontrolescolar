import { Request, Response, NextFunction } from 'express';

// Manejador centralizado de errores para que la API no se caiga nunca
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('❌ Error no capturado:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error Interno del Servidor';

  res.status(statusCode).json({
    status: 'error',
    message,
    // En producción se ocultaría el 'stack' por seguridad
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
