import express from 'express'
import isAuthenticated from '../middelware/isAuthenticated.js';
import openAIContoller from '../controllers/openAIContoller.js';
const router = express.Router();

router.post('/generate',isAuthenticated,openAIContoller.openAIController)

export default router