import {Router} from 'express';
import { currentUser, loginUser, logoutUser, registerUser, updateProfile } from '../../controller/user/user.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {registerSchema,loginSchema, validateSchema} from "../../validators/user.validator.js"
import { authenticate } from '../../middlewares/auth.middleware.js';

const router=Router();

router.post("/register",validate(registerSchema),registerUser);
router.post("/login",validate(loginSchema),loginUser);
router.post("/logout",authenticate,logoutUser);
router.get("/current",authenticate,currentUser);
router.patch("/update-profile",authenticate,validate(validateSchema),updateProfile);



export default router;