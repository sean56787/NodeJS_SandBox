let users = [
    { id: 1, name: 'alice' },
    { id: 2, name: 'bob' },
    { id: 3, name: 'charlie' },
    { id: 4, name: 'david' },
    { id: 5, name: 'eve' },
    { id: 6, name: 'frank' },
];

module.exports = {
    findAll: () => {
        return users;
    },
    findByName: (name) => users.find(user => user.username === name),
    findById: (id) => users.find(u => u.id === id),
    create: (userPayload, role = 'user') => {
        const newUser = {
            id:users.length+1, 
            username: userPayload.username, 
            password: userPayload.hashedPassword,
            email: userPayload.email,
            role,
        }
        users.push(newUser);
        return newUser;
    },
    update: (id, name) => {
        const user = users.find(u => u.id ===id);
        if(!user) return null;
        user.name = name;
        return user;
    },
    remove: (id) => {
        const index = users.find(u=>u.id===id);
        if(index === -1) return false;
        users.splice(index, 1);
        return true; 
    },
    findPaginated: (page = 1, limit = 3) => {
        const offset = (page - 1) * limit;
        const paginatedUsers = users.slice(offset, offset + limit);

        return {
            data: paginatedUsers,
            total: users.length,
            page,
            totalPages: Math.ceil(users.length / limit),
        };
    },
    verifyUser: (username) =>{
        const user = users.find(u=>u.username === username);
        if(user) user.isVerified = true;
        return user;
    },
};