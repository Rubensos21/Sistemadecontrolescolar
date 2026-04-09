import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Intenta parsear el body, params y query en base al esquema proporcionado
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Enviar respuesta clara con los errores de validación
        return res.status(400).json({
          status: 'error',
          message: 'Error de validación de datos',
          errors: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
      }
      return next(error);
    }
  };
};
