const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
app.listen(port, () => {
  console.log(`App running on port ${port}!!`);
});
