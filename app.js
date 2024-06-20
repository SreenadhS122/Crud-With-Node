const express = require('express');
const app = express();
const session = require('express-session')
const cache = require('nocache');
const logger = require('morgan');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const {mongo} = require('./dbConnect/dbConnect');
mongo();
const loginRoute = require('./routes/login');
const registerRoute = require('./routes/employeeRoute');


app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use('/',loginRoute);
app.use('/',registerRoute);
app.set('view engine','ejs');
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized :false,
    cookie : {maxAge : 3600000}
}));
app.use(express.json());
app.use(cache());
app.use(logger('dev'));

app.listen(process.env.PORT || 8080);