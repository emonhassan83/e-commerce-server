const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoutes');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const categoryRouter = require('./routes/prodCategoryRoutes');
const blogCategoryRouter = require('./routes/blogCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middleware/errorHandler');

//connect to DB
dbConnect();

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("dev"));

// app.use('/', (req, res) => {
//     res.send("Hello form server side!");
// })

//ROUTES
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogCategory', blogCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);


//use Error Handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Server is running at PORT ${PORT}`);
})