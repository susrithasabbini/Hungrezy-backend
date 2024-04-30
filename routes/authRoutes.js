import express from 'express'
import { verificationController,authController } from '../controllers/index.js';
import * as validations from '../middleware/validations/authValidation.js';


const initAuthRoutes = ()=>{
  const authRoutes = express.Router();
  authRoutes.post('/send-verification-code', verificationController.sendVerificationCode);
  authRoutes.post('/verify-code', verificationController.verifyCode);
  authRoutes.post('/refresh-token', authController.refresh_Token);
  authRoutes.post('/user/signup',validations.signup,authController.signup);
  authRoutes.post('/user/signin',validations.signin,authController.signin);
  authRoutes.post('/restaurant/signup',validations.restaurantSignup,authController.restaurantSignup);
  authRoutes.post('/restaurant/signin',validations.restaurantSignin,authController.restaurantSignin);
  authRoutes.post('/admin/signup',validations.adminSignup,authController.adminSignup);
  authRoutes.post('/admin/signin',validations.adminSignin,authController.adminSignin);
  authRoutes.post('/signin-otp/send-verification-code',validations.signinSendOtp,authController.signinSendOtp);
  authRoutes.post('/signin-otp/verify-code',validations.signinVerifyOtp,authController.signinVerifyOtp);
  return authRoutes;
}



export default initAuthRoutes;
