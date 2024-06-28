const express = require('express');
const app = express();
const session = require('express-session')
const cache = require('nocache');
const logger = require('morgan');
const cookieParser =  require('cookie-parser');
const {mongo} = require('./dbConnect/dbConnect');
const loginRoute = require('./routes/login');
const employeeRoute = require('./routes/employeeRoute');
const adminRoute = require('./routes/adminRoute');
const logoutRoute = require('./routes/logout');

require('dotenv').config();

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized :false,
    cookie : {maxAge : 3600000}
}));
app.use(cache());
app.use(logger('dev'));
app.use(cookieParser());
app.use('/',loginRoute);
app.use('/employee',employeeRoute);
app.use('/admin',adminRoute);
app.use('/',logoutRoute);

mongo();
app.listen(process.env.PORT || 8080);