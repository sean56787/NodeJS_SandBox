const User = require('../models/userModel');

exports.getAllUsers = (req, res) => {
    const users = User.findAll();
    res.json(users);
};
exports.getUserById = (req, res) =>{
    const user = User.findById(parseInt(req.params.id));
    if(!user) return res.status(404).json({error: 'user not found'})
    res.json(user);
};
exports.getUserByName = (req, res) =>{
    const user = User.findByName(req.params.username);
    if(!user) return res.status(404).json({error: 'user not found'})
    res.json(user);
};
