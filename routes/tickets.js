var express = require('express');
var tokenMiddleware = require('../middleware/token');

var User = require('../models/user');
var Event = require('../models/event');
var Ticket = require('../models/ticket');

var router = express.Router();

router.get('/:ticketId', tokenMiddleware.verifyToken, function getEvent(request, response) {

  console.log(request.params);

  Ticket
  .findOne({
    id: request.params.ticketId
  })
  .populate('createdBy')
  .populate('event')
  .exec(function handleQuery(error, ticket) {

    if (error) {
      response.status(500).json({
        success: false,
        message: 'Internal server error'
      });

      throw error;
    }

    if (! ticket) {
      response.status(404).json({
        success: false,
        message: "Can't find ticket with id " + request.params.ticketId + "."
      });

      return;
    }

    var usernameFromToken = tokenMiddleware.getUsernameFromToken(request);

    if (usernameFromToken !== ticket.createdBy.username) {
      response.status(404).json({
        success: false,
        message: "Can't find ticket with id " + request.params.ticketId + "."
      });

      return;
    }

    response.json({
      success: true,
      ticket: ticket
    });
  });
});

router.post('/', tokenMiddleware.verifyToken, function createEvent(request, response) {

  console.log(request.body);

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

    Event.findOne({
      id: request.body.eventId
    }, function handleQuery(error, event) {

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
          message: "Can't find event with id " + request.body.eventId + "."
        });

        return;
      }

      console.log(event);

      var ticket = new Ticket({
        event: event._id,
        price: request.body.price,
        createdBy: user._id
      });

      ticket.save(function (error) {

        if (error) {
          response.status(500).json({
            success: false,
            message: 'Internal server error'
          });

          throw error;
        }

        event.tickets.push(ticket);

        event.save(function (error) {

          if (error) {
            response.status(500).json({
              success: false,
              message: 'Internal server error'
            });

            throw error;
          }

          user.tickets.push(ticket);

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
              ticket: ticket
            });
          });
        });
      });
    });
  });
});

module.exports = router;