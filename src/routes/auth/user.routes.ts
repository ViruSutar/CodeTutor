import { Router } from "express";
import { LoginValidator, RegisterValidator } from "../../validator/auth/user.validator";
import { loginUser, registerUser,refreshAccessToken, logoutUser } from "../../controllers/user.controller";
import { validate } from "../../validator/validate";
import { verifyJWT } from "../../middlewares/auth.middleware";

const router = Router()

// Unsecured route
verifyJWT
router.route("/register").post(RegisterValidator(),validate,registerUser)

router.route('/login').post(LoginValidator(),validate,loginUser)
router.route('/logout').get(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken);



export default router;