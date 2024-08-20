import express from 'express'
import usersRouter from './routes/usersRouter.js'
import mongoose from 'mongoose'
import 'dotenv/config'


const app =express()
const PORT = process.env.PORT || 5000

app.use(express.json());

app.use('/api/v1/users',usersRouter)


mongoose.connect(process.env.MONGODB_URL).then(()=>{
    app.listen(PORT , ()=>{
        console.log("server is runing on port " + PORT)

    })

})

