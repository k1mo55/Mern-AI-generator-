import express from 'express'
import usersController from '../controllers/usersController.js';
import { validateRegister } from '../middelware/validation.js';

const router = express.Router();


router.post('/register', validateRegister ,usersController.register);


export default router