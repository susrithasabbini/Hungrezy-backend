import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';

const hashPassword = async (plainPassword) => {
    return bcrypt.hash(plainPassword, 10);
};

const comparePasswords = async (hashedPassword, plainPassword) => {
    return bcrypt.compare(plainPassword, hashedPassword);
};


const generateRandomOTP = (length=6) => {
    return randomstring.generate({
        length: length,
        charset: 'numeric',
      });
};


export {
    hashPassword,
    comparePasswords,
    generateRandomOTP,
}