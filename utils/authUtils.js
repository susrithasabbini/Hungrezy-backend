import jsonwebtoken from 'jsonwebtoken';
import {JWT_SECRET, JWT_REFRESH_SECRET} from '../config/index.js';


const generateJWT = (payload, secret, expiresIn) => {
    return jsonwebtoken.sign(payload, secret, {expiresIn});
};

const generateAccessToken = async(payload, expiry = '4h') => {
    try {
        return generateJWT(payload, JWT_SECRET, expiry);
    } catch (error) {
        console.error(`ERROR in generateAccessToken() => ${error}`);
    }
}

const generateRefreshToken = async(payload, expiry = '24h') => {
    try {
        return generateJWT(payload, JWT_REFRESH_SECRET, expiry);
    } catch (error) {
        console.error(`ERROR in generateRefreshToken() => ${error}`);
    }
}

const verifyJWT = async (token) => {
    return jsonwebtoken.verify(token, JWT_SECRET);
};

const verifyRefreshJWT = async (token) => {
    return jsonwebtoken.verify(token, JWT_REFRESH_SECRET);
};


export {
    generateAccessToken,
    generateRefreshToken,
    verifyJWT,
    verifyRefreshJWT,
}
