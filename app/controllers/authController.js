const {v4:uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');
const tokenStore = require('../utils/verifyTokenStore');
const emailService = require('../services/emailService');

exports.register = async(req, res) =>{
    const {username, password, email} = req.body;
    if(!username || !password || !email)
        return res.status(400).json({error:'username / password /email are required'});
    if(userModel.findByName(username))
        return res.status(409).json({error: 'user already exists'});
    const hashedPassword = await bcrypt.hash(password, 10);

    // test
    let role = 'user';
    if(username == 'admin') role = 'admin';
    //

    const userPayload = {
        username,
        hashedPassword,
        email,
        isVerified: false,
    }

    userModel.create(userPayload, role);
    const verifyToken = uuidv4();
    tokenStore.saveToken(verifyToken, username);
    await emailService.sendVerificationEmail(email, verifyToken);

    res.json({msg:'registed success, pls go verify your email'});
};

exports.verifyEmail = (req, res) =>{
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
    const user = userModel.findByName(username);

    if(!user.isVerified) return res.status(401).json({error: 'email not verified'});
    if(!user) return res.status(401).json({error: 'not registed'});
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(401).json({error: 'wrong password'});

    const payload = {id: user.id, username: user.username, role: user.role};

    const accessToken = jwt.sign(payload, 'secret_key', {expiresIn:'15m'});
    const refreshToken = jwt.sign(payload, 'refresh_key', {expiresIn: '3h'});

    tokenModel.add(refreshToken);
    res.json({accessToken, refreshToken});
};

exports.refreshToken = (req, res) =>{
    const {token} = req.body;
    if(!token) return res.status(400).json({error: 'refresh token required'});
    if(!tokenModel.exists(token)) return res.status(403).json({error:'invalid refresh token'});
    try{
        const user = jwt.verify(token, 'refresh_key');
        const payload = {id: user.id, username: user.username, role: user.role};
        const newAccessToken = jwt.sign(payload, 'secret_key', {expiresIn: '15m'});
        res.json({accessToken: newAccessToken});
    }catch(err){
        return res.status(403).json({error: 'invalid refresh token'});
    }
};

exports.logout = (req, res) => {
    const {token} = req.body;
    if(!token) return res.status(400).json({error: 'refresh token required'});
    if(!tokenModel.exists(token)) return res.status(403).json({error:'invalid refresh token'});
    try{
        tokenModel.remove(token);
    }catch(error){
        return res.status(404).json({error: 'remove token failed'});
    }
    res.json({msg:'logged out'});
};

exports.createUser = async (req, res) =>{
    const {username, password, role} = req.body;
    if(!username || !password || !role)
        return res.status(400).json({error:'username / password / role are required'});
    if(userModel.findByName(username))
        return res.status(409).json({error: 'user already exists'});
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userModel.create(username, hashedPassword, role);
    res.status(201).json({msg:'user created by admin', user: {id: user.id, username: user.username, role: user.role}});
};

exports.updateUser = (req, res) => {
    const {name} = req.body;
    const updated = User.update(parseInt(req.params.id),name);
    if(!updated) return res.status(404).json({error:'user not found'})
    res.json(updated);
};

exports.removeUser = (req, res) => {
    const success = User.remove(parseInt(req.params.id));
    if(!success) return res.status(404).json({error:'user not found'})
    res.status(204).send();
};