const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyparser = require('body-parser');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * @param req express http request
 * @returns true if the http request is secure (comes form https)
 */
function isSecure(req) {
  if (req.headers['x-forwarded-proto']) {
    return req.headers['x-forwarded-proto'] === 'https';
  }
  return req.secure;
};

// redirect any page form http to https
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test' && !isSecure(req)) {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended : true}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'assets')));

app.use('/', require('./routes/router'));

module.exports = app;
