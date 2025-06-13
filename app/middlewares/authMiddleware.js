//權限中介

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; //拿header
    if(!authHeader || !authHeader.startsWith('Bearer ')){ 
        return res.status(401).json({error:'token missing'});
    }

    const token = authHeader.split(' ')[1];     //分離token

    try{
        const user = jwt.verify(token, 'secret_key');  //驗證 token 是否有效
        console.log(`current user => ${JSON.stringify(user)}`);
        req.user = user;    //讓後續操作可以認得此帳號
        next();
    } catch(err){
        return res.status(403).json({error: 'invalid token'});
    }
};

exports.requireAdmin = (req, res, next) => {    //確認是否為admin
    if(req.user.role !=='admin'){
        return res.status(403).json({error:'admin only'});
    }
    next();
}
