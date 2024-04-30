import {UserVerification} from '../models/index.js';
import { emailService } from '../services/index.js';
import { passwordUtils,authUtils } from '../utils/index.js';


const sendVerificationCode = async (req, res) => {
  const { email, user_role } = req.body;
  const verificationCode = passwordUtils.generateRandomOTP(6);
  try {
    let userVerification = await UserVerification.findOne({ email, user_role });
    if (userVerification) {
      userVerification.otp = verificationCode;
    } else {
      userVerification = new UserVerification({ email, user_role, otp: verificationCode });
    }
    await userVerification.save();
    await emailService.sendVerificationEmail(email, verificationCode);
    res.status(200).json({ message: 'Verification code sent successfully.'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const verifyCode = async (req, res) => {
  const { email, verificationCode,user_role } = req.body;
  try {
    const userVerification = await UserVerification.findOne({ email,user_role});
    if (userVerification && userVerification.otp === verificationCode) {
      const payload = {email}
      const accessToken = await authUtils.generateAccessToken(payload,'1h');
      res.status(200).json({ message: 'Verification successful!',token : accessToken  });
    } else {
      res.status(401).json({ error: 'Invalid verification code.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { sendVerificationCode, verifyCode };
