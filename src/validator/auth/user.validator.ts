import { body, param } from "express-validator";
import { AvailableUserRoles } from "../../contants";

export const RegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("firstName")
      .trim()
      .notEmpty()
      .withMessage("firstName is required")
      .isLength({ min: 3 })
      .withMessage("firstName must be at lease 3 characters long"),
    body("lastName")
      .trim()
      .notEmpty()
      .withMessage("lastName is required")
      .isLength({ min: 3 })
      .withMessage("lastName must be at lease 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("role")
      .optional()
      .isIn(AvailableUserRoles)
      .withMessage("Invalid user role"),
  ];
};

export const LoginValidator = ()=>{
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ]
};
