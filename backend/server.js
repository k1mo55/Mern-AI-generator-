import express from 'express'
import usersRouter from './routes/usersRouter.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import openAIRouter from './routes/openAIRouter.js'
import stripeRouter from './routes/stripeRouter.js'
import cron from 'node-cron'
import User from './models/User.js';

dotenv.config();

const app =express()
const PORT = process.env.PORT || 5000

cron.schedule('* * * * * *',async ()=>{
    try{
       const updatedUser =  User.updateMany({
            trialActive:true,
            nextBillingDate:{$lt:new Date()}
        },{
            trialActive:false,
            subscriptionPlan:'Free',
            monthlyRequestCount:5
        })
    }catch(err){
        console.log(err)
    }

})

app.use(express.json());
app.use(cookieParser())
app.use('/api/v1/users',usersRouter)
app.use('/api/v1/openai',openAIRouter)
app.use('/api/v1/stripe',stripeRouter)

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    app.listen(PORT , ()=>{
        console.log("server is runing on port " + PORT)

    })

})

