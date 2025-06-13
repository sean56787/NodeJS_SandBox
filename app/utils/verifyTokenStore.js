//信箱驗證專用token model

const tokenMap = new Map();

exports.saveToken = (token, username) =>{
    tokenMap.set(token, {username, createAt: Date.now()});
};

exports.getUsernameByToken = (token) =>{
    return tokenMap.has(token) ? tokenMap.get(token).username : null;
};

exports.deleteToken = (token) =>{
    tokenMap.delete(token);
}