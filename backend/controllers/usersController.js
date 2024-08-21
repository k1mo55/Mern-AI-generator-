import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken' 


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

const loginController = async ( req , res )=>{
    try{
        const { email , password } = req.body;
        const userExist = await User.findOne( { email:email } )
        
        if(!userExist){
            return res.status(404).json( { messsage:"Invalid email or password" } )
        }
        const isMatch = await bcrypt.compare(password , userExist.password)
        if(!isMatch){
            return res.status(404).json( { messsage:"Invalid email or password" } )
        }
        const token  = jwt.sign({ id:userExist._id }, process.env.JWT_SECRET_KEY, {
            expiresIn:"1d"

        })
        res.cookie('token',token,{
            httpOnly:true,
        })

        res.status(200).json({
            username:userExist.username,

        })


    }catch(err){
        res.status(500).json({ message:"internal server error" })

    }
}

const logoutController =  async( req , res ) =>{
    try{
        res.cookie('token','',{ maxAge:1 });
        res.status(200).json({
            message: "logout successfull"
        })
    }catch(err){
        res.status(500).json({ message:"internal server error" })
    }
}

const getUserController =  async ( req, res )=>{
    try{
        const user = await User.findById( req.userId ).select('-password');
        if(!user){
            res.status(404).json({ messsage:"user doesn't exist" })
        }
        
        res.status(200).json({
            user
        })


    }catch(err){
        res.status(500).json({ message:"internal server error" })
    }
}


export default {
    register,
    loginController,
    logoutController,
    getUserController

}