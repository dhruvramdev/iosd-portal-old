import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import router from './routes/index';
import mongodb from './database/mongodb';
import hbs from 'express-hbs';

import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session' ;
import config from './config/config' ;
import flash from 'connect-flash' ;
let MongoDBStore = connectMongo(session);

const port = process.env.PORT || 8888;

let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

let store = new MongoDBStore({
    uri: config.database,
    collection: 'appSessions'
});

store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});

app.use(session({
    secret: 'iloveiosd', // session secret
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

import passport_config from './middlewares/passport' ;
passport_config(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.engine('hbs', hbs.express4({
    partialsDir: __dirname + '/views/partials' ,
    layoutsDir: __dirname + '/views/layouts' ,
    defaultLayout: __dirname + '/views/layouts/' + 'default',
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


app.use('/', router);
app.use(express.static('static'));
app.use('/media' , express.static('media'));


hbs.registerHelper('replacespace', function(text, options) {
    return text.replace(" " , "")
});

hbs.registerHelper('shorten', function(text, options) {
    console.log(options);
    return text.slice(0,options);
});

hbs.registerHelper('captialize', function(text, options) {
    return text.charAt(0).toUpperCase() + text.slice(1);
});

hbs.registerHelper('textify', function(text, options) {
    let a = text.replace(/<img[^>]*>/g,"");
    return a.slice(0,150);
});

hbs.registerHelper('postDate', function(text, options) {
    let m = text.slice(5,7);
    let d = text.slice(8,10);
    return d+"/"+m
});

mongodb.getConnection()
  .then((msg) => {
    console.log(msg);
    app.listen(port, () => {
      console.log(`Server running and listening in http://localhost:${port}`);
    });
    // require('./scripts/gen.js');
  })
  .catch((err) => {
    console.log(err);
  });
