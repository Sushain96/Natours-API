const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

//Creating Schema

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A TOUR MUST HAVE A NAME'],
      unique: true,
      maxlength: ['40', 'A name should not be exceeding 40 characters.'],
      minlength: ['10', 'A name should  be atleast 100 characters.'],
      // validate: [validator.isAlpha, 'Tour name is only characters '],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A TOUR MUST HAVE A DURATION'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A TOUR MUST HAVE A GROUP SIZE'],
    },
    difficulty: {
      type: String,
      required: [true, 'A TOUR MUST HAVE A DIFFICULTY'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Invalid Difficulty',
      },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'MIN RATINGS 1'],
      max: [5, 'MAX RATINGS 5'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A TOUR MUST HAVE A PRICE'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points  to current doc on  NEW document creation.
          return val < this.price;
        },
        message: ' DISCOUNT PRICE {VALUE} > PRICE',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A TOUR MUST HAVE A Summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A TOUR MUST HAVE AN IMAGE'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middleware runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Embedding Guides in the tour

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds.`);
  next();
});

//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// Creating Model
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
