import { Router } from "express";
import { LoginValidator, RegisterValidator } from "../../validator/auth/user.validator";
import { loginUser, registerUser,refreshAccessToken } from "../../controllers/user.controller";
import { validate } from "../../validator/validate";
// import { validate } from "../../validator/validate";


const router = Router()


//Plan to make auth routes
// Make structure like that open source project
// understand about access token and refresh token
// write register route 
// login ,auth ,logout route 

// Unsecured route
router.route("/register").post(RegisterValidator(),validate,registerUser)

router.route('/login').post(LoginValidator(),validate,loginUser)
router.route("/refresh-token").post(refreshAccessToken);



export default router;