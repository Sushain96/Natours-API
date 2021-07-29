const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!. SHUTTING DOWN');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');
const { getTour } = require('./controllers/tourController');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//mongoose Setup
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB CONNECTION SUCCESSFUL');
  });
// .catch((err) => {
//   console.log('ERROR');
// });

//Logs

// console.log(process.env);
console.log(process.env.NODE_ENV);

//Initiating local host server
let port;
if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT;
} else if (process.env.NODE_ENV === 'development') {
  port = 3000;
}
const server = app.listen(port, () => {
  console.log(`App running on port ${port}!!`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDELED REJECTION . SHUTTING DOWN');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
