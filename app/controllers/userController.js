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
exports.createUser = (req, res) =>{
    const {name} = req.body;
    console.log('name:'+name);
    if(!name) return res.status(400).json({error:'name is required'})
    const newUser = User.create(name);
    res.status(201).json(newUser);
};
exports.updateUser = (req, res) => {
    const {name} = req.body;
    const updated = User.update(parseInt(req.params.id),name);
    if(!updated) return res.status(404).json({error:'user not found'})
    res.json(updated);
}
exports.removeUser = (req, res) => {
    const success = User.remove(parseInt(req.params.id));
    if(!success) return res.status(404).json({error:'user not found'})
    res.status(204).send();
}