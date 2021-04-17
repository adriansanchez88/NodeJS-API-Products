const { check } = require('express-validator');
const { commonValidationResult } = require('../commons');
const { validToken, validRole } = require('../../services/authServices');

const _emailRequired = check('email', 'Email required').not().isEmpty();
const _emailValid = check('email', 'Email is invalid').isEmail();
const _passwordRequired = check('password', 'Password required').not().isEmpty();
const validJWT = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = await validToken(token);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}
const hasRole = (...roles) => {
    return (req, res, next) => {
        try {
            validRole(req.user, ...roles);
            next();
        } catch (error) {
            next(error);
        }
    }
}

const postLoginRequestValidation = [
    _emailRequired,
    _emailValid,
    _passwordRequired,
    commonValidationResult
];

module.exports = {
    postLoginRequestValidation,
    validJWT,
    hasRole
};
