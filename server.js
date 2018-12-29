var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname)));
app.use("/css", express.static(__dirname + '/css'));
app.use("/img", express.static(__dirname + '/imagen'));
app.use("/js", express.static(__dirname + '/scripts'));
app.use("/php", express.static(__dirname + '/php'));

// viewed at based directory http://localhost:8080/
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/home.html'));
});

// add other routes below
app.get('/sign-in', function (req, res) {
  res.sendFile(path.join(__dirname + '/iniciosesion.html'));
});
app.get('/sing-up', function (req, res) {
  res.sendFile(path.join(__dirname + '/registro.html'));
});
app.get('/perfil_de_usuario', function (req, res) {
  res.sendFile(path.join(__dirname + '/perfilUsuario.html'));
});
app.get('/recuperar_contrasena', function (req, res) {
  res.sendFile(path.join(__dirname + '/recuperarPass.html'));
});

app.listen(process.env.PORT || 8080);
