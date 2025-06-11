const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireAdmin} = require('../middlewares/authMiddleware');

//need token
router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', verifyToken, userController.getUserById);
//need token & admin
router.post('/',verifyToken, requireAdmin, userController.createUser);
router.put('/:id',verifyToken, requireAdmin, userController.updateUser);
router.delete('/:id',verifyToken, requireAdmin ,userController.removeUser);

module.exports = router