import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const register = async ( req ,res )=>{
    try{
        const { username , email , password } = req.body

        const userExist =  await User.findOne({ email:email })
        if(userExist){
            return res.status(400).json({ message:"email already exists" })
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashPassword =  await bcrypt.hash(password , salt);
        
        const newUser = new User({
            username,
            password:hashPassword,
            email,
           
        })
       newUser.trialExpires= new Date(  new Date().getTime() + newUser.trialPeriod *24 *60 * 1000  )
       
        await newUser.save();
        res.status(200).json({
            message:"successfull",
            user:{
                username,
                email
            }
        })

    }catch(err){
        console.log(err)
        res.status(500).json( { message:"internal server error" } )

    }


}



export default {
    register

}