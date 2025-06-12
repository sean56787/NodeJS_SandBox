const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken} = require('../middlewares/authMiddleware');
//need token
router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
router.get('/:username', verifyToken, userController.getUserByName);

module.exports = router