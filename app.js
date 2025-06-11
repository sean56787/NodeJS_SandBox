const express = require('express');
const app = express();
const userRoutes = require('./app/routes/userRoutes');

app.use(express.json());
app.use('/api/users', userRoutes);
app.get('/', (req,res)=>{
    res.send('welcome to user api');
})

module.exports = app;