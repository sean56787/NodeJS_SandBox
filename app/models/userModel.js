// 用戶模擬資料 model

let users = [ //範例
    { id: 1, username: 'alice' },
    { id: 2, username: 'bob' },
    { id: 3, username: 'charlie' },
    { id: 4, username: 'david' },
    { id: 5, username: 'eve' },
    { id: 6, username: 'frank' },
];

module.exports = {
    findAll: () => {            //回傳所有用戶
        return users;
    },
    findByName: (name) => {            //以名稱查詢
        const user = users.find(user => user.username === name)
        return user;
    },
    findById: (id) => users.find(u => u.id === id),                 //以id查詢
    create: (userPayload, role = 'user') => {                 //新增
        const newUser = {
            id:users.length+1, 
            username: userPayload.username, 
            password: userPayload.hashedPassword,
            email: userPayload.email,
            isVerified: userPayload.isVerified,
            role,
        }
        users.push(newUser);
        return newUser;
    },
    update: (name, hashedPassword, email, role) => {        //更新
        const user = users.find(u => u.username === name);
        if(!user) return null;
        user.password = hashedPassword;
        if(email!==undefined) user.email = email;
        if(role!==undefined) user.role = role;
        return user;
    },
    remove: (name) => {                                     //刪除
        const index = users.findIndex(u=>u.username===name);
        if(index === -1) return false;
        users.splice(index, 1);
        return true; 
    },
    findPaginated: (page = 1, limit = 3) => {               //分頁給資料
        const offset = (page - 1) * limit;
        const paginatedUsers = users.slice(offset, offset + limit);

        return {
            data: paginatedUsers,
            total: users.length,
            page,
            totalPages: Math.ceil(users.length / limit),
        };
    },
    verifyUser: (username) =>{                              //信箱驗證 預設不啟用
        const user = users.find(u=>u.username === username);
        if(user) user.isVerified = true;
        return user;
    },
};