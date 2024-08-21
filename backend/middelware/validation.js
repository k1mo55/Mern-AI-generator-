
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (req , res, next)=>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        console.log({errors:errors.array})
        return res.status(400).json({ errors:errors.array() })

    }
    next();
}



export const validateRegister = [
    body("username").isString().notEmpty().withMessage("username is requried"),
    body("email").isString().isEmail().notEmpty().withMessage("email is requried"),
    body("password").isString().notEmpty().withMessage("username is requried").isLength({ min:6}).withMessage("minimum of 6 characters"),
    handleValidationErrors
]

export const validateLogin = [
    body("email").isString().isEmail().notEmpty().withMessage("email is requried"),
    body("password").isString().notEmpty().withMessage("username is requried").isLength({ min:6}).withMessage("minimum of 6 characters"),
    handleValidationErrors
]