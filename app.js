const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRoutes');

const app = express();

//Global Middlewares
//Security Http Headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests try again after 1 Hr',
});

app.use('/api', limiter);

//Body parser, reading data from body into req.body

app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection

app.use(mongoSanitize());

// Data sanitization against XSS

app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuntity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving Static files
app.use(express.static(`${__dirname}/public`));

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers)
  next();
});
//creating Routes

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter); //Mounting the Router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // req
  //   .status(404)
  //   .json({ status: 'fail', message: ` Invalid URL ${req.originalUrl}` });

  // const err = new Error(` Invalid URL ${req.originalUrl}`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(` Invalid URL ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
