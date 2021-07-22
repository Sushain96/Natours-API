const mongoose = require('mongoose');

//Creating Schema

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A TOUR MUST HAVE A NAME'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A TOUR MUST HAVE A PRICE'],
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

//creating documents

//   const testTour = new Tour({
//     name: 'The  Park Camper',
//     rating: 4.6,
//     price: 320,
//   });

//   testTour
//     .save()
//     .then((doc) => {
//       console.log(doc);
//     })
//     .catch((err) => {
//       console.log('ERROR:', err);
//     });
