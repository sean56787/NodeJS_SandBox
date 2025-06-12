let users = [
    
];

module.exports = {
    findAll: () => {
        return users;
    },
    findByName: (name) => users.find(user => user.username === name),
    findById: (id) => users.find(u => u.id === id),
    create: (username, hashedPassword, role = 'user') => {
        const newUser = {
            id:users.length+1, 
            username: username, 
            password: hashedPassword,
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
    }
};