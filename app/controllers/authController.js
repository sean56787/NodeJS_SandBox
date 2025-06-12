const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const tokenModel = require('../models/tokenModel');

exports.register = async(req, res) =>{
    const {username, password} = req.body;
    if(!username || !password)
        return res.status(400).json({error:'username / password are required'});
    if(userModel.findByName(username))
        return res.status(409).json({error: 'user already exists'});
    const hashedPassword = await bcrypt.hash(password, 10);
    //test
    if(username == 'admin') role = 'admin';
    //
    const user = userModel.create(username, hashedPassword, role);
    res.status(201).json({msg:'user registed', user: {id: user.id, username: user.username, role: user.role}});
};

exports.login = async (req, res) => {
    const {username, password} = req.body;
    const user = userModel.findByName(username);

    if(!user) return res.status(401).json({error: 'not registed'});
    const match = await bcrypt.compare(password, user.password);
    if(!match) return res.status(401).json({error: 'wrong password'});

    const payload = {id: user.id, username: user.username, role: user.role};

    const accessToken = jwt.sign(payload, 'secret_key', {expiresIn:'1m'});
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
        const newAccessToken = jwt.sign(payload, 'secret_key', {expiresIn: '1m'});
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