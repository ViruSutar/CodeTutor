import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';


export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors: { [key: string]: string }[] = errors.array().map((err) => ({
    [err.param]: err.msg,
  }));

  // 422: Unprocessable Entity
  throw new ApiError(422, "Received data is not valid", extractedErrors);
};
