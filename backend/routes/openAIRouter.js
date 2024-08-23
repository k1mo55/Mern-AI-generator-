import express from 'express'
import isAuthenticated from '../middelware/isAuthenticated.js';
import openAIContoller from '../controllers/openAIContoller.js';
import  checkRequestCount  from '../middelware/checkApiRequestLimit.js'
const router = express.Router();

router.post('/generate',isAuthenticated,checkRequestCount,openAIContoller.openAIController)

export default router