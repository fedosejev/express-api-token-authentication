var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jsonwebtoken = require('jsonwebtoken');
var app = express();

var CONFIG = require('./config.json');
var PORT = CONFIG.server.port;
var HOST_NAME = CONFIG.server.hostName;
var DATABASE_NAME = CONFIG.database.name;
var TOKEN_SECRET = CONFIG.token.secret;
var TOKEN_EXPIRES = CONFIG.token.expiresInSeconds;
var User = require('./models/user');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME);

var apiRouter = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRouter.post('/users/authenticate', function authenticateUser(request, response) {

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

      response.status(401).json({
        success: false,
        message: 'Authentication failed. User not found.'
      });

    } else if (user) {

      // check if password matches
      if (user.password !== request.body.password) {

        response.status(401).json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });

      } else {

        // if user is found and password is right
        // create a token
        var token = jsonwebtoken.sign({ username: user.username }, TOKEN_SECRET, {
          expiresIn: TOKEN_EXPIRES
        });

        // return the information including token as JSON
        response.json({
          success: true,
          token: token
        });
      }
    }
  });
});

apiRouter.post('/users/', function createUser(request, response) {

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

    if (user) {
      response.status(409).json({
        success: false,
        message: 'User with the username \'' + request.body.username + '\' already exists.'
      });

      return;
    }

    var user = new User({
      username: request.body.username,
      password: request.body.password
    });

    user.save(function (error) {

      if (error) {
        response.status(500).json({
          success: false,
          message: 'Internal server error'
        });

        throw error;
      }

      response.json({
        success: true
      });
    });
  });
});

// route middleware to verify a token
apiRouter.use(function verifyToken(request, response, next) {

  // check header or url parameters or post parameters for token
  var token = request.body.token || request.query.token || request.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jsonwebtoken.verify(token, TOKEN_SECRET, function (error, decoded) {
      if (error) {

        response.status(403).json({
          success: false,
          message: 'Failed to authenticate token.'
        });

        return;

      } else {

        // if everything is good, save to request for use in other routes
        request.decoded = decoded;

        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    response.status(403).json({
      success: false,
      message: 'No token provided.'
    });
  }
});

apiRouter.get('/items/', function getAllItems(request, response) {

  response.json({
    success: true
  });

});

app.use('/api', apiRouter);

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
