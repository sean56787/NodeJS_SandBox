//權限route

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireAdmin} = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {registerSchema, loginSchema, tokenSchema} = require('../validations/authValidation');

//need to follow schema
router.post('/register', validate(registerSchema), authController.register); //註冊
router.post('/login', validate(loginSchema), authController.login);          //登入
router.post('/refresh', validate(tokenSchema), authController.refreshToken); //使用refresh token 重新獲取 json web token
router.post('/logout', validate(tokenSchema), authController.logout);        //登出，系統將刪除refresh token

//need token & admin
router.post('/',verifyToken, requireAdmin, authController.createUser);       //新增用戶(admin專用)
router.put('/',verifyToken, requireAdmin, authController.updateUser);     //更新用戶(admin專用)
router.delete('/',verifyToken, requireAdmin ,authController.removeUser);  //移除用戶(admin專用)

module.exports = router; //導出

//驗證郵件(需要在emailService 輸入 senderEmail、appPassword才能使用) 此功能先預設不啟用
router.get('/verify-email', authController.verifyEmail);                     