import { z } from "zod";

const simplifyZodErrors = (error: z.ZodError) => {
  return error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message
  }));
};

export { simplifyZodErrors };