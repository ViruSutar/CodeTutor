import { Router } from "express";
import { userRegisterValidator } from "../../validator/auth/user.validator";
import { validate } from "../../validator/validate";


const router = Router()


//Plan to make auth routes
// Make structure like that open source project
// understand about access token and refresh token
// write register route 
// login ,auth ,logout route 

// Unsecured route
router.route("/register").post(userRegisterValidator(),validate)