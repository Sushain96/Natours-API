const fs = require('fs');
const Tour = require('./../models/tourModel');

//getting static data
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

//middleware to check for ID validity
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'FAIL',
      message: 'Invalid ID entered',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({
      status: 'FAIL',
      message: "Name can't be ENOTEMPTY",
    });
  }
  next();
};
//Route Handler/Controller

exports.getAllTours = (req, res) => {
  res.status(200).json({
    Status: 'Success',
    RequestTimeStamp: req.requestTime,
    Results: tours.length,
    Data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  // if (id >= tours.length) {
  //   return res.status(404).json({
  //     status: 'FAIL',
  //     message: 'Invalid ID entered',
  //   });
  // }

  res.status(200).json({
    Status: 'Success',
    Data: {
      tour: tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        Data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  // if (req.params.id * 1 >= tours.length) {
  //   return res.status(404).json({
  //     status: 'FAIL',
  //     message: 'Invalid ID entered',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'YOUR UPDATED DATA',
    },
  });
};

exports.deleteTour = (req, res) => {
  // if (req.params.id * 1 >= tours.length) {
  //   return res.status(404).json({
  //     status: 'FAIL',
  //     message: 'Invalid ID entered',
  //   });
  // }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
