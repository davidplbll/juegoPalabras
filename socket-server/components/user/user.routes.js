'use strict'

var express = require('express');
var userControler = require('./user.controler');
var api = express.Router();

api.post('/register',userControler.register);
api.post('/login',userControler.login);
api.post('/iniciojuego',userControler.iniciarJuego);
api.get('/palabrainicial',userControler.palabrainicial);
api.get('/palabra/:letra',userControler.palabrarandom);
api.post('/validar',userControler.validar);
api.post('/rendirce',userControler.rendirce);
api.post('/finjuego',userControler.finjuego);

module.exports = api;