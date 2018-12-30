var express = require('express');
var jquery = require('jquery');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname)));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img", express.static(__dirname + '/img'));
app.use("/js", express.static(__dirname + '/js'));

// viewed at based directory http://localhost:8080/
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// add other routes below
app.get('/sign-in', function (req, res) {
  res.sendFile(path.join(__dirname + '/inicio_sesion.html'));
});

app.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/editor', function (req, res) {
  res.sendFile(path.join(__dirname + '/editor.html'));
});
app.listen(process.env.PORT || 8080);
