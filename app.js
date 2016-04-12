var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var CONFIG = require('./config.json');
var PORT = parseInt(CONFIG.server.port, 10);
var HOST_NAME = CONFIG.server.hostName;
var DATABASE_NAME = CONFIG.database.name;

var tokenMiddleware = require('./middleware/token');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

mongoose.connect('mongodb://' + HOST_NAME + '/' + DATABASE_NAME);

var usersRoutes = require('./routes/users');
var eventsRoutes = require('./routes/events');
var ticketsRoutes = require('./routes/tickets');

app.use('/api/users', usersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/tickets', ticketsRoutes);

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});