import User from "../models/User.js"



const checkRequestCount = async ( req , res , next)=>{
    try{
        const user =await User.findById ( req.userId );
    if(!user){
        return res.status(404).json({ message:"cannot find user" })
    }

    if( user.trialActive && user.apiRequestCount>=user.monthlyRequestCount){
        return res.status(500).json({ message:"api request limit reached subscribe to a plan" })
    }
    next();
    }catch(err){
        res.status(500).json( { message:"internal server error" } )
    }
    
}

export default checkRequestCount