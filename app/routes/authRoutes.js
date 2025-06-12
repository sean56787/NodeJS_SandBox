const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireAdmin} = require('../middlewares/authMiddleware');

//login
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

//need token & admin
router.post('/',verifyToken, requireAdmin, authController.createUser);
router.put('/:id',verifyToken, requireAdmin, authController.updateUser);
router.delete('/:id',verifyToken, requireAdmin ,authController.removeUser);

module.exports = router;