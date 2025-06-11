const jwt = require('jsonwebtoken');
exports.login = (req, res) => {
    const {username} = req.body;
    const user = {
        id:1,
        username,
        role: username === 'admin' ? 'admin' : 'user',
    };
    const token = jwt.sign(user, 'secret_key', {expiresIn:'1h'});
    res.json({token});
}