import { authUtils } from "../utils/index.js";


const isAuthenticated = async (req, res, next) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }
    try {
        if (token) {
            const decode = await authUtils.verifyJWT(token);
            req.user_id = decode.id
            req.user_role = decode.user_role
            req.user_mongo_id = decode.user._id
            next();
        } else {
            res.status(401).send({
                status: 401,
                message : 'Your session is invalid. Please signin.'
            });
        }
    } catch (error) {
        console.error(error);
        if (error.message === 'jwt expired') {
            res.status(401).send({
                message: 'Session expired',
                data: [],
                errors: error,
                errorMessage: 'Session expired.',
                showMessage: true,
            });
        } else {
            res.status(500).send({
                message: error.message,
                data: [],
                errors: error,
                errorMessage: 'Session expired.',
                showMessage: true,
            });
        }
    }
};


export {
    isAuthenticated,
}