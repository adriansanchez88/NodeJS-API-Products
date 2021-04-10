const { Router } = require('express');
const { login } = require('../controllers/auth');
const { postLoginRequestValidation } = require('../middlewares/auth');

const router = Router();

router.post('/login', postLoginRequestValidation, login);

module.exports = router;