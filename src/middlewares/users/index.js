const { check } = require('express-validator');
const AppError = require('../../errors/appError');
const userService = require('../../services/userService');
const {ROLES, ADMIN_ROLE} = require('../../constants');
const { commonValidationResult } = require('../commons');
const { validJWT, hasRole } = require('../auth');

const _idRequired = check('id', 'Id required').not().isEmpty();
const _nameRequired = check('name', 'Name required').not().isEmpty();
const _lastNameRequired = check('lastName', 'Last Name required').not().isEmpty();
const _emailRequired = check('email', 'Email required').not().isEmpty();
const _emailValid = check('email', 'Email is invalid').isEmail();
const _optionalEmailValid = check('email', 'Email is invalid').optional().isEmail();
const _emailExist = check('email').custom(
    async(email = '') => {
        const userFound = await userService.findByEmail(email);
        if (userFound) {
            throw new AppError('Email already exist', 400);
        }
    }
);
const _optionalEmailExist = check('email').optional().custom(
    async (email = '') => {
        const userFound = await userService.findByEmail(email);
        if (userFound) {
            throw new AppError('Email already exist', 400);
        }
    }
);
const _passwordRequired = check('password', 'Password required').not().isEmpty();
const _roleValid = check('role').optional().custom(
    async (role = '') => {        
        if (!ROLES.includes(role)) {
            throw new AppError('Role invalid', 400);
        }
    }
);
const _birthdateValid = check('birthdate', 'Birthdate is invalid').optional().isDate('MM-DD-YYYY');
const _idIsMongoDB = check('id').isMongoId();
const _idExist = check('id').custom(
    async (id = '') => {
        const userFound = await userService.findById(id);
        if (!userFound) {
            throw new AppError(`User with id '${id}' does not exist`, 400);
        }
    }
);

const postRequestValidations = [
    validJWT,
    hasRole(ADMIN_ROLE),
    _nameRequired,
    _lastNameRequired,
    _emailRequired,
    _emailValid,
    _emailExist,
    _passwordRequired,
    _roleValid,
    _birthdateValid,
    commonValidationResult
];
const putRequestValidations = [
    validJWT,
    hasRole(ADMIN_ROLE),
    _idRequired,
    _idIsMongoDB,
    _idExist,
    _optionalEmailValid,
    _optionalEmailExist,
    _roleValid,
    _birthdateValid,
    commonValidationResult
]
const deleteRequestValidations = [
    validJWT,
    hasRole(ADMIN_ROLE),
    _idRequired,
    _idIsMongoDB,
    _idExist,    
    commonValidationResult
]
const getRequestValidations = [
    validJWT,
    _idRequired,
    _idIsMongoDB,
    _idExist,    
    commonValidationResult
]
const getAllRequestValidations = [
    validJWT, 
    commonValidationResult
]

module.exports = {
    postRequestValidations,
    putRequestValidations,
    deleteRequestValidations,
    getRequestValidations,
    getAllRequestValidations
};
