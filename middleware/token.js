var jsonwebtoken = require('jsonwebtoken');
var CONFIG = require('../config.json');
var TOKEN_SECRET = CONFIG.token.secret;

// route middleware to verify a token
function verifyToken(request, response, next) {

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
      }

      // if everything is good, save to request for use in other routes
      request.decoded = decoded;

      next();
    });

  } else {

    // if there is no token
    // return an error
    response.status(403).json({
      success: false,
      message: 'No token provided.'
    });
  }
}

function getTokenPayload(request) {
  var payload = null;

  // check header or url parameters or post parameters for token
  var token = request.body.token || request.query.token || request.headers['x-access-token'];

  if (token) {
    payload = jsonwebtoken.decode(token, { complete: true }).payload;
  }

  return payload;
}

function getUsernameFromToken(request) {
  var payload = getTokenPayload(request);

  if (payload) {
    return payload.username;
  }

  return null;
}

module.exports = {
  verifyToken: verifyToken,
  getUsernameFromToken: getUsernameFromToken
};