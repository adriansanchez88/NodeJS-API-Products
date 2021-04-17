const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const AppError = require('../errors/appError');
const logger = require('../loaders/logger');
const config = require('../config');

const login = async (email, password) => {
    try {
        // Validación de email
        const user = await userService.findByEmail(email);
        if (!user) {
            throw new AppError('Authentication failed! Email / password does not correct.', 400);
        }

        //Validación de usuario habilitado
        if(!user.enable){
            throw new AppError('Authentication failed! User disabled.', 400);
        }

        //Validación de password
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            throw new AppError('Authentication failed! Email / password does not correct.', 400);
        }

        //Generar JWT
        const token = _encrypt(user._id);

        return {
            token,
            user: user.name,
            role: user.role
        }
        

    } catch (error) {
        throw error;        
    }
}

_encrypt = (id) => {
    return jwt.sign({ id }, config.auth.secret, { expiresIn: config.auth.ttl });
}

const validToken = async (token) => {
    try {
        // Validar que el token venga como parametro
        if (!token) {
            throw new AppError('Authentication failed! Token required', 401);
        }

        // Validar que el token sea integro
        let id;
        try {            
            const obj = jwt.verify(token, config.auth.secret);
            id = obj.id;
        } catch (error) {
            throw new AppError('Authentication failed! Invalid Token', 401);
        }

        // Validar si el usuario existe en la BD
        const user = await userService.findById(id);
        if (!user) {
            throw new AppError('Authentication failed! Invalid Token', 401);
        }

        // Validar si el usuario esta habilitado
        if (!user.enable) {
            throw new AppError('Authentication failed! User disabled', 401);
        }

        return user;
    } catch (error) {
        throw error;        
    }
}

const validRole = (user, ...roles) => {
    if (!roles.includes(user.role)) {
        throw new AppError('Authorization failed! User without permissions', 403);        
    }
    return true;
}

module.exports = {
    login,
    validToken,
    validRole
};
