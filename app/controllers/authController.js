//權限管理 需要admin

const {v4:uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');
const tokenStore = require('../utils/verifyTokenStore');
const emailService = require('../services/emailService');

exports.register = async(req, res) =>{
    const {username, password, email = '', id = -1} = req.body;
    if(!username || !password)
        return res.status(400).json({error:'username / password are required'});
    if(userModel.findByName(username))
        return res.status(409).json({error: 'user already exists'});
    const hashedPassword = await bcrypt.hash(password, 10);

    // test
    let role = 'user';
    if(username == 'admin') role = 'admin';
    //

    const userPayload = {
        id,
        username,
        hashedPassword,
        email: email || '',
        isVerified: email? false:true,
    }

    const result = userModel.create(userPayload, role);
    const verifyToken = uuidv4();
    tokenStore.saveToken(verifyToken, username);

    try{
        if(email !== ''){ //有給email才會啟用
            await emailService.sendVerificationEmail(email, verifyToken); //寄出驗證郵件
            res.json({msg:'registed success, pls go verify your email to login'});
        }
        else{
            res.status(201).json({msg:'registed success, pls login', detail: `isVerified: ${result.isVerified}`});
        }
    } catch(error){
        res.status(500).json({error: error.message});
    }
    
};

exports.verifyEmail = (req, res) =>{ // 驗證信箱，於信箱點擊驗證連結即可
    const token = req.query.token;
    const username = tokenStore.getUsernameByToken(token);

    if(!username){
        return res.status(400).json({error:'invalid verify link'});
    }

    userModel.verifyUser(username);
    tokenStore.deleteToken(token);

    res.json({msg:"account verified success"});
}

exports.login = async (req, res) => {
    const {username, password} = req.body;
    const user = userModel.findByName(username);        //先找用戶名稱
    if(!user) return res.status(401).json({error: 'not registed'});
    if(!user.isVerified) return res.status(401).json({error: 'email not verified'});

    const match = await bcrypt.compare(password, user.password);            //再驗證密碼
    if(!match) return res.status(401).json({error: 'wrong password'});

    const payload = {id: user.id, username: user.username, role: user.role};

    const accessToken = jwt.sign(payload, 'secret_key', {expiresIn:'15m'}); //普通access token 有效期限15分鐘
    const refreshToken = jwt.sign(payload, 'refresh_key', {expiresIn: '3h'}); //refresh token 用來重新獲取 普通access token

    tokenModel.add(refreshToken);
    res.json({accessToken, refreshToken});
};

exports.refreshToken = (req, res) =>{
    const {refreshToken} = req.body;
    if(!refreshToken) return res.status(400).json({error: 'refresh token required'});
    if(!tokenModel.exists(refreshToken)) return res.status(403).json({error:'invalid refresh token'});
    try{
        const user = jwt.verify(refreshToken, 'refresh_key');  //驗證refresh token
        const payload = {id: user.id, username: user.username, role: user.role};
        const newAccessToken = jwt.sign(payload, 'secret_key', {expiresIn: '15m'}); //重簽一個access token
        res.json({accessToken: newAccessToken});
    }catch(err){
        return res.status(403).json({error: 'invalid refresh token'});
    }
};

exports.logout = (req, res) => {
    const {refreshToken} = req.body;
    if(!refreshToken) return res.status(400).json({error: 'refresh token required'});
    if(!tokenModel.exists(refreshToken)) return res.status(403).json({error:'invalid refresh token'});
    try{
        tokenModel.remove(refreshToken);               //從伺服器刪除refresh Token 不讓使用者再拿新的access token
    }catch(error){
        return res.status(404).json({error: 'remove token failed'});
    }
    res.json({msg:'logged out'});
};

exports.createUser = async (req, res) =>{                   //新增用戶 需要admin
    const {username, password, role, email = '', id = -1} = req.body;
    if(!username || !password || !role)
        return res.status(400).json({error:'username / password / role are required'});
    if(userModel.findByName(username))
        return res.status(409).json({error: 'user already exists'});
    const hashedPassword = await bcrypt.hash(password, 10);

    const userPayload = {
        id,
        username,
        hashedPassword,
        email: email || '',
        isVerified: email? false:true,
    }

    const user = userModel.create(userPayload, role);
    res.status(201).json({msg:'user created by admin', user: {id: user.id, username: user.username, role: user.role}});
};

exports.updateUser = async (req, res) => {                  //更新用戶 需要admin
    const {username, password, email, role} = req.body;
    if(!username || !password)
        return res.status(400).json({error:'name / password are required'});
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = userModel.update(username, hashedPassword, email, role);
    if(!updated) return res.status(404).json({error:'user not found'})
    res.status(201).json({msg:'user updated by admin', user: {id: updated.id, username: updated.username, role: updated.role}});
};

exports.removeUser = (req, res) => {                        //刪除用戶 需要admin
    const {username} = req.body;
    const success = userModel.remove(username);
    if(!success) return res.status(404).json({error:'user not found'})
    console.log(`${username} deleted by admin`);
    res.status(204).send();                                 //不回傳
};