//用戶route

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin} = require('../middlewares/authMiddleware');
//need token
router.get('/', verifyToken, requireAdmin, userController.getAllUsers);
router.get('/id/:id', verifyToken, requireAdmin, userController.getUserById);
router.get('/name/:username', verifyToken, requireAdmin, userController.getUserByName);

module.exports = router