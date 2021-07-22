const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

//Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
