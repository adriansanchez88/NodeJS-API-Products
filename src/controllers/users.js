const express = require('express');
const userService = require('../services/userService');
const Success = require('../handlers/successHandler');

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.findAll(req.query.filter, req.query.options);
        res.json(new Success(users));
    } catch (error) {
        next(error);        
    }
};

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
 const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userService.findById(id);
        
        res.json(new Success(user));
    } catch (error) {
        next(error);
    }
};

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const createUser = async (req, res, next) => {
    
    try {
        let user = req.body;
        user = await userService.save(user);
        
        res.status(201).json(new Success(user));
    } catch (error) {
        next(error);
    }
};

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        let user = req.body;        
        const userUpdated = await userService.update(id, user);

        res.json(new Success(userUpdated));
    } catch (error) {
        next(error);
    }
};

/**
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
const deleteUser = async (req, res, next) => {
    try {
        // const {id} = req.params;
        const id = req.params.id;
        const user = await userService.remove(id);       
        
        res.json(new Success(user));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}