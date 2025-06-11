const express = require('express');
const app = express();
const userRoutes = require('./app/routes/userRoutes');
const authRoutes = require('./app/routes/authRoutes');

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req,res)=>{
    res.send('welcome to user api');
})

module.exports = app;