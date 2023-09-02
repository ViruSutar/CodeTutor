import { body, param } from "express-validator";
import { AvailableUserRoles } from "../../contants";

const userRegisterValidator = () => {
    return [
      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Email is invalid"),
      body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLowercase()
        .withMessage("Username must be lowercase")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
      body("password").trim().notEmpty().withMessage("Password is required"),
      body("role")
        .optional()
        .isIn(AvailableUserRoles) // Replace AvailableUserRoles with an array of valid roles.
        .withMessage("Invalid user role"),
    ];
  };



  export {
    userRegisterValidator
  }