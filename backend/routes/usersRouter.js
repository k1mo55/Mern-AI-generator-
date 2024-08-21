import express from 'express'
import usersController from '../controllers/usersController.js';
import { validateRegister ,validateLogin} from '../middelware/validation.js';
import isAuthenticated from '../middelware/isAuthenticated.js';

const router = express.Router();


router.post('/register', validateRegister ,usersController.register);
router.post('/login',validateLogin,usersController.loginController )
router.post('/logout',usersController.logoutController )
router.get('/profile',isAuthenticated,usersController.getUserController )

export default router