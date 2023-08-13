const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoutes')

//connect to DB
dbConnect();

app.use('/', (req, res) => {
    res.send("Hello form server side!");
})

//ROUTES
app.use('/api/user', authRouter);

app.listen(PORT, ()=> {
    console.log(`Server is running at PORT ${PORT}`);
})