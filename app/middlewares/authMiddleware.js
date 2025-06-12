const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error:'token missing'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const user = jwt.verify(token, 'secret_key');
        console.log(`current verified user => ${JSON.stringify(user)}`);
        req.user = user;
        next();
    } catch(err){
        return res.status(403).json({error: 'invalid token'});
    }
};
exports.requireAdmin = (req, res, next) => {
    if(req.user.role !=='admin'){
        return res.status(403).json({error:'admin only'});
    }
    next();
}
