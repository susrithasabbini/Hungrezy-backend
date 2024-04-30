import { passwordUtils, authUtils } from "../utils/index.js";
import { emailService } from "./index.js";
import { User, Restaurant, Admin, UserVerification } from "../models/index.js";
import * as Constants from "../constants/userRoleConstants.js";

const signin = async (payload) => {
  const { email, password } = payload;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return {
        status: 400,
        message: "User not found! Please Signup first",
      };
    }
    if (user.status !== "active") {
      return {
        status: 400,
        message: `Your account is ${user.status}! Please contact admin for more details.`,
      };
    }
    if (!(await passwordUtils.comparePasswords(user.password, password))) {
      return {
        message: "Incorrect Password! Please try again.",
        status: 400,
      };
    }
    const accessToken = await authUtils.generateAccessToken({
      id: user.email,
      user_role: Constants.USER_ROLE,
      user,
    });
    const refreshToken = await authUtils.generateRefreshToken({ user });
    const token = {};
    token.accessToken = accessToken;
    token.refreshToken = refreshToken;
    token.user = user;
    return {
      status: 200,
      message: "Sign in Successfull!",
      token: token,
    };
  } catch (error) {
    console.error(error);
  }
};

const signinSendOtp = async (payload) => {
  const { email, user_role } = payload;
  try {
    let user;
    if (user_role == Constants.USER_ROLE) user = await User.findOne({ email });
    else if (user_role == Constants.USER_ROLE_RESTAURANT)
      user = await Restaurant.findOne({ email });
    else if (user_role == Constants.USER_ROLE_ADMIN)
      user = await Admin.findOne({ email });
    if (!user) {
      return {
        status: 400,
        message: "User not found! Please Signup first",
      };
    }
    if (user.status !== "active") {
      return {
        status: 400,
        message: `Your account is ${user.status}! Please contact admin for more details.`,
      };
    }

    const verificationCode = passwordUtils.generateRandomOTP(6);
    let userVerification = await UserVerification.findOne({ email, user_role });
    if (userVerification) {
      userVerification.otp = verificationCode;
    } else {
      userVerification = new UserVerification({
        email,
        user_role,
        otp: verificationCode,
      });
    }
    await userVerification.save();
    await emailService.sendVerificationEmail(email, verificationCode);
    return {
      status: 200,
      message: "Verification code sent successfully!",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

const signinVerifyOtp = async (payload) => {
  const { email, user_role, verificationCode } = payload;
  try {
    const userVerification = await UserVerification.findOne({ email });
    if (userVerification && userVerification.otp === verificationCode) {
      let user;
      if (user_role == Constants.USER_ROLE)
        user = await User.findOne({ email });
      else if (user_role == Constants.USER_ROLE_RESTAURANT)
        user = await Restaurant.findOne({ email });
      else if (user_role == Constants.USER_ROLE_ADMIN)
        user = await Admin.findOne({ email });
      const accessToken = await authUtils.generateAccessToken(
        { id: email, user_role: user_role, user },
        "1h"
      );
      const refreshToken = await authUtils.generateRefreshToken({ user });
      const token = {};
      token.accessToken = accessToken;
      token.refreshToken = refreshToken;
      token.user = user;
      return {
        status: 200,
        message: "Sign in Successfull!",
        token: token,
      };
    } else {
      return {
        status: 401,
        message: "Invalid verification code",
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const signup = async (payload) => {
  const { email, password, lastName, firstName, mobileNumber, accessToken } =
    payload;
  try {
    const decode = await authUtils.verifyJWT(accessToken);
    if (decode) {
      const hashPassword = await passwordUtils.hashPassword(password);
      const temp = {
        email,
        firstName,
        lastName,
        mobileNumber,
        password: hashPassword,
      };
      let user = new User(temp);
      await user.save();
      const accessToken = await authUtils.generateAccessToken({
        id: user.email,
        user_role: Constants.USER_ROLE,
        user,
      });
      const refreshToken = await authUtils.generateRefreshToken({ user });
      const token = {};
      token.accessToken = accessToken;
      token.refreshToken = refreshToken;
      token.user = user;
      return {
        status: 200,
        message: "Sign up successfull!",
        token: token,
      };
    } else {
      return {
        message: "Signup failed! Please try again.",
        status: 400,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

const restaurantSignin = async (payload) => {
  const { email, password } = payload;
  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return {
        status: 400,
        message: "Restaurant not found! Please Signup first",
      };
    }
    if (restaurant.status !== "approved") {
      return {
        status: 400,
        message: `Your account is ${restaurant.status}! Please contact admin for more details.`,
      };
    }

    if (
      !(await passwordUtils.comparePasswords(restaurant.password, password))
    ) {
      return {
        message: "Incorrect Password! Please try again.",
        status: 400,
      };
    }
    const accessToken = await authUtils.generateAccessToken({
      id: restaurant.email,
      user_role: Constants.USER_ROLE_RESTAURANT,
      user: restaurant,
    });
    const refreshToken = await authUtils.generateRefreshToken({ restaurant });
    const token = {};
    token.accessToken = accessToken;
    token.refreshToken = refreshToken;
    token.user = restaurant;
    return {
      status: 200,
      message: "Sign in Successfull!",
      token: token,
    };
  } catch (error) {
    console.error(error);
  }
};

const restaurantSignup = async (payload) => {
  const { email, password, name, accessToken } = payload;
  try {
    const decode = await authUtils.verifyJWT(accessToken);
    if (decode) {
      const hashPassword = await passwordUtils.hashPassword(password);
      const temp = {
        email,
        name,
        password: hashPassword,
      };
      let restaurant = new Restaurant(temp);
      await restaurant.save();
      const accessToken = await authUtils.generateAccessToken({
        id: restaurant.email,
        user_role: Constants.USER_ROLE_RESTAURANT,
        user: restaurant,
      });
      const refreshToken = await authUtils.generateRefreshToken({ restaurant });
      const token = {};
      token.accessToken = accessToken;
      token.refreshToken = refreshToken;
      token.user = restaurant;
      return {
        status: 200,
        message: "Sign up successfull!",
        token: token,
      };
    } else {
      return {
        message: "Signup failed! Please try again.",
        status: 400,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: 400,
      message: error,
    };
  }
};

const adminSignin = async (payload) => {
  const { email, password } = payload;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return {
        status: 400,
        message: "Admin not found! Please Signup first",
      };
    }
    if (!admin.active) {
      return {
        message: "This account is not active!",
        status: 400,
      };
    }
    // if(!await passwordUtils.comparePasswords(admin.password,password)){
    //     return{
    //         message: 'Incorrect Password! Please try again.',
    //         status: 400,
    //     }
    // }
    const accessToken = await authUtils.generateAccessToken({
      id: admin.email,
      user_role: admin.superAdmin
        ? Constants.USER_ROLE_SUPERADMIN
        : Constants.USER_ROLE_ADMIN,
      user: admin,
    });
    const refreshToken = await authUtils.generateRefreshToken({ admin });
    const token = {};
    token.accessToken = accessToken;
    token.refreshToken = refreshToken;
    token.user = admin;
    return {
      status: 200,
      message: "Sign in Successfull!",
      token: token,
    };
  } catch (error) {
    console.error(error);
  }
};

const adminSignup = async (payload) => {
  const {
    email,
    password,
    lastName,
    firstName,
    superAdmin,
    //   accessToken,
  } = payload;
  try {
    // const decode = await authUtils.verifyJWT(accessToken);
    // if(decode){
    // const hashPassword = await passwordUtils.hashPassword(password)
    const temp = {
      email,
      firstName,
      lastName,
      password,
      superAdmin,
    };
    let admin = new Admin(temp);
    await admin.save();
    const accessToken = await authUtils.generateAccessToken({
      id: admin.email,
      user_role: superAdmin
        ? Constants.USER_ROLE_SUPERADMIN
        : Constants.USER_ROLE_ADMIN,
      user: admin,
    });
    const refreshToken = await authUtils.generateRefreshToken({ admin });
    const token = {};
    token.accessToken = accessToken;
    token.refreshToken = refreshToken;
    token.user = admin;
    return {
      status: 200,
      message: "Sign up successfull!",
      token: token,
    };
    // }else{
    //     return {
    //         message: 'Signup failed! Please try again.',
    //         status: 400,
    //     };
    // }
  } catch (error) {
    console.error(error);
  }
};

export {
  signin,
  signup,
  restaurantSignup,
  restaurantSignin,
  adminSignin,
  adminSignup,
  signinSendOtp,
  signinVerifyOtp,
};
