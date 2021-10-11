let express = require('express');
const cors = require('cors')
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let connexionRouter = require('./routes/connexion');

let app = express();

app.use(cors()) // <= permet d'autoriser les connexions depuis toutes les adresses

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/connexion', connexionRouter);
app.use('/', indexRouter);

module.exports = app;
