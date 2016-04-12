var express = require('express');
var tokenMiddleware = require('../middleware/token');

var User = require('../models/user');
var Event = require('../models/event');

var router = express.Router();

router.get('/:eventId', function getEvent(request, response) {

  console.log(request.params);

  Event
  .findOne({
    id: request.params.eventId
  })
  .populate('tickets')
  .exec(function handleQuery(error, event) {

    if (error) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
      });

      throw error;
    }

    if (! event) {
      response.status(404).json({
        success: false,
        message: "Can't find event with id " + request.params.eventId + "."
      });

      return;
    }

    response.json({
      success: true,
      event: event
    });
  });
});

router.post('/', tokenMiddleware.verifyToken, function createEvent(request, response) {

  console.log(request.body);

  // find the user
  User.findOne({
    username: request.body.username
  }, function handleQuery(error, user) {

    if (error) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
      });

      throw error;
    }

    if (! user) {
      response.status(404).json({
        success: false,
        message: "Can't find user with username " + request.body.username + "."
      });

      return;
    }

    console.log(user);

    var event = new Event({
      description: request.body.description,
      price: request.body.price,
      createdBy: user._id,
      lastName: request.body.lastName
    });

    event.save(function (error) {

      if (error) {
        response.status(500).json({
          success: false,
          message: 'Internal server error'
        });

        throw error;
      }

      user.events.push(event);

      user.save(function (error) {

        if (error) {
          response.status(500).json({
            success: false,
            message: 'Internal server error'
          });

          throw error;
        }

        response.json({
          success: true,
          event: event
        });
      });
    });
  });
});

module.exports = router;