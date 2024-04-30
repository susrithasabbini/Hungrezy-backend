import Joi from 'joi';
import {
        validate,
        emailValidation,
        passwordValidation,
        mobileNumberValidation
    } from './common.js';

const signin  = async(req,res,next)=>{
    const schema = Joi.object({
        email : emailValidation.required(),
        password : passwordValidation.required(),
    })
    await validate(schema,req,res,next);
}

const signinSendOtp = async(req,res,next)=>{
    const schema = Joi.object({
        email : emailValidation.required(),
        user_role : Joi.string().required()
    })
    await validate(schema,req,res,next);
}

const signinVerifyOtp = async(req,res,next)=>{
    const schema = Joi.object({
        email : emailValidation.required(),
        user_role : Joi.string().required(),
        verificationCode : Joi.string().required(),
    })
    await validate(schema,req,res,next);
}

const restaurantSignin  = async(req,res,next)=>{
    const schema = Joi.object({
        email : emailValidation.required(),
        password : passwordValidation.required(),
    })
    await validate(schema,req,res,next);
}

const adminSignin  = async(req,res,next)=>{
    const schema = Joi.object({
        email : emailValidation.required(),
        password : passwordValidation.required(),
    })
    await validate(schema,req,res,next);
}

const signup  = async(req,res,next)=>{
    const schema = Joi.object({
        email : emailValidation.required(),
        password : passwordValidation.required(),
        mobileNumber : mobileNumberValidation.required(),
        firstName : Joi.string().required(),
        lastName : Joi.string().allow(''),
        accessToken : Joi.string().required(),
    })
    await validate(schema,req,res,next);
}

const restaurantSignup  = async(req,res,next)=>{
    const schema = Joi.object({
        email : emailValidation.required(),
        password : passwordValidation.required(),
        name : Joi.string().required(),
        accessToken : Joi.string().required(),
    })
    await validate(schema,req,res,next);
}

const adminSignup  = async(req,res,next)=>{
    const schema = Joi.object({
        email : emailValidation.required(),
        password : passwordValidation.required(),
        firstName : Joi.string().required(),
        lastName : Joi.string().allow(''),
        superAdmin : Joi.boolean(),
    })
    await validate(schema,req,res,next);
}


export {
    signin,
    signup,
    restaurantSignup,
    restaurantSignin,
    adminSignin,
    adminSignup,
    signinSendOtp,
    signinVerifyOtp,
}