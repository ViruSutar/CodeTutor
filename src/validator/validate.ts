import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

    // const extractedErrors = errors.array().map((err) => ({
    //   ["err.path"]: err.msg,
    // }));

  // 422: Unprocessable Entity
  //   throw new ApiError(422, "Received data is not valid", extractedErrors);


  return res.status(422).json({status:false, errors: errors.array() });
};
