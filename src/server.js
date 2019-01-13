const express = require('express');
const app = express();

const path = require('path'); //permite manejar las rutas
const mongoose = require('mongoose'); //permite conectarse a mongodb
const passport = require('passport'); //configura la manera de autentificacion en el sistema
const flash = require('connect-flash'); //
const morgan = require('morgan'); //define los metodos http que llegan del servidor
const cookieParser = require('cookie-parser'); //modulo para admiistrar las cookies
const bodyParser = require('body-parser'); //procesa la informacion del servidor
const cookieSession = require('cookie-session'); //
//const formidable = require('express-formidable');

const methodOverride = require('method-override');

const { url } = require('./config/database.js');


mongoose.connect(url, {
	useNewUrlParser: true
}).then(() => console.log('conneted to db'))
.catch(err => console.log(err));

require('./config/passport')(passport);

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// required for passport
app.use(cookieSession({
	name: "session",
	keys:["secreto1","secreto2"]
}));

// middlewares
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
//app.use(formidable.parse({ keepExtensions: true}));
app.use(methodOverride("_method"));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require('./routes.js')(app, passport);

// static files
console.log("direction: " + __dirname + '/css');
app.use("/css", express.static(path.join(__dirname, 'css')));
app.use("/img", express.static(path.join(__dirname, 'img')));
app.use("/js", express.static(path.join(__dirname, 'js')));

// start the server
app.listen(app.get('port'), () => {
	console.log('server on port ', app.get('port'));
});
