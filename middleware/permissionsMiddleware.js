import { USER_ROLE,USER_ROLE_RESTAURANT } from "../constants/userRoleConstants.js";

const isRestaurant = async(req,res,next)=>{
    try{
        if(req.user_role!=USER_ROLE_RESTAURANT)res.status(403).send({
            message: 'Access denied',
        });
        else next()
    }catch(error){
        next(error)
    }
}

const isUser = async(req,res,next)=>{
    try{
        if(req.user_role!=USER_ROLE)res.status(403).send({
            message: 'Access denied',
        });
        else next()
    }catch(error){
        next(error)
    }
}

export {
    isRestaurant,
    isUser,
}