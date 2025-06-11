let users = [
    {id: 1, name:'alice'},
    {id: 2, name:'bob'}
];

module.exports = {
    findAll: () => {
        return users;
    },
    findById: (id) => users.find(u => u.id === id),
    create: (name) => {
        const newUser = {id: users.length + 1, name};
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