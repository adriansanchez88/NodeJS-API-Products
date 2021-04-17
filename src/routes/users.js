const { Router } = require('express');
const {
    getAllUsers,
    getUserById, 
    createUser, 
    updateUser,  
    deleteUser
} = require('../controllers/users');
const { 
    postRequestValidations, 
    putRequestValidations,
    deleteRequestValidations,
    getRequestValidations,
    getAllRequestValidations
} = require('../middlewares/users');

const router = Router();

router.get('/', getAllRequestValidations, getAllUsers);
router.get('/:id', getRequestValidations, getUserById);
router.post('/', postRequestValidations, createUser);
router.put('/:id', putRequestValidations, updateUser);
router.delete('/:id', deleteRequestValidations, deleteUser);

module.exports = router;