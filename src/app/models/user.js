const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs'); //permite sifrar la clave

//establece el modelo de mongoose para registrarse
const userSchema = new mongoose.Schema({
  local: {
    email: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    password: String
  },
  twitter: {
    id: String,
    token: String,
    email: String,
    password: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    password: String
  }
});

// generating a hash, sifra la contraseña antes de guardar
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// revisa por comparacion si la contraseña que dio el usuario es valida
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password);
};

// exporta el modelo
module.exports = mongoose.model('User', userSchema);
