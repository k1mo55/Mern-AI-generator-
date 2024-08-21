import express from 'express'
import usersRouter from './routes/usersRouter.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import openAIRouter from './routes/openAIRouter.js'
dotenv.config();

const app =express()
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cookieParser())
app.use('/api/v1/users',usersRouter)
app.use('/api/v1/openai',openAIRouter)

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    app.listen(PORT , ()=>{
        console.log("server is runing on port " + PORT)

    })

})

