import mongoose from 'mongoose';

const userVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  user_role: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

const UserVerification = mongoose.model('UserVerification', userVerificationSchema);

export default UserVerification;
