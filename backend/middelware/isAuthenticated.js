import jwt from 'jsonwebtoken'

const isAuthenticated = async ( req, res , next) =>{
    try{
        let token = req.cookies["token"]
        if(!token){
            return res.status(401).json( { message:"unathorized" } );
        }
        const decoded = jwt.verify( token , process.env.JWT_SECRET_KEY );
        req.userId= decoded.id;
        next();

    }catch(err){
        return res.status(500).json( { message:"Internal server error"  } )
    }
}

export default isAuthenticated