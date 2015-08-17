var http = require('http'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    //io = require('socket.io')(80),
    cfg = require('./config.json'),
    Twitter = require('node-tweet-stream'),
    t = new Twitter(cfg),
    port = process.env.PORT || 80,
    _ = require('underscore'),
    bodyParser = require('body-parser'),
    //errorHandler = require('errorhandler'),

    receivedTweets = [],
    loadedTweets,
    foundIDs = [];

app.use(bodyParser());
//app.use(errorHandler()); // Only for dev
app.set('jsonp callback', true);

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get(/^(.+)$/, function(req, res) {
  res.sendFile(__dirname + '/public/' + req.params[0]);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
 
server.listen(port, function() {
  console.log('Listening on ' + port);
});

t.track('pizza');
t.on('tweet', function(tweet){
  console.log('TWITTER: TWEETS CAME IN...');
  console.log(tweet);

  io.emit('tweet', tweet);
});

t.on('error', function (err) {
  console.log('Oh no ', err);
})