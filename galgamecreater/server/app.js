var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var fileRoutes = require('./routes/fileRoutes');
var imgRoutes = require('./routes/imgRoutes');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 添加CORS中间件以允许特定源的请求
// 允许所有来源的请求
const allowedOrigin = 'http://localhost:3000';
app.use(cors({ origin: allowedOrigin }));
// 添加 CORS 头以允许跨源请求
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","*");
  res.header("Access-Control-Allow-Methods","*");
  next();
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/file', fileRoutes);
app.use('/img', imgRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3300, () => {
  console.log('Server is running on port 3300');
});
module.exports = app;
