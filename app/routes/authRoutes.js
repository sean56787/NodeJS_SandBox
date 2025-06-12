const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireAdmin} = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {registerSchema, loginSchema, tokenSchema} = require('../validations/authValidation');
//login
router.post('/register', validate(registerSchema), authController.register);
router.get('/verify-email', authController.verifyEmail);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(tokenSchema), authController.refreshToken);
router.post('/logout', validate(tokenSchema), authController.logout);

//need token & admin
router.post('/',verifyToken, requireAdmin, authController.createUser);
router.put('/:id',verifyToken, requireAdmin, authController.updateUser);
router.delete('/:id',verifyToken, requireAdmin ,authController.removeUser);

module.exports = router;