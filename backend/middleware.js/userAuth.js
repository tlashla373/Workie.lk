import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const{token} = req.cookies;

    if(!token){
        return res.json({msg: "You are not authenticated."})
    }
    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }else{
            return res.json({success:false ,messsage: "You are not authenticated."})
        }

        next();

    }catch(error){
        return res.json({success:false, message:error.message});
    }
    

}

export default userAuth;