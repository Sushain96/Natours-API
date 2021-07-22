const express = require('express');
const morgan = require('morgan');
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
  console.log('Middleware added');
  next();
});

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

module.exports = app;
