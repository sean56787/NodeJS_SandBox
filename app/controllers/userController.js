// 用戶查詢 需要admin

const User = require('../models/userModel');

exports.getAllUsers = (req, res) => {
    const {page, limit} = req.query;

    if(page !== undefined && limit !== undefined){
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        if(isNaN(page) || isNaN(limit)){
            return res.status(400).json({error:"invalid page or limit value"});
        }
        const result = User.findPaginated(page, limit);
        return res.json(result);
    }

    const users = User.findAll();
    console.log(JSON.stringify(users, null, 2));
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
