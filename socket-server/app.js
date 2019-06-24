var app = require('express')();
const serviceRoutes=require('./components/user/user.routes');
var bodyParser = require('body-parser');
var games={}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); //GLOBALS.WEB_PAGE_URL);
  res.header('Access-Control-Allow-Headers', 'Authorization, authorizationprovider, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Request-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use('/user', serviceRoutes);

const http = require('http').Server(app);
const io = require('socket.io')(http);
const documents = {};

io.on("connection", socket => {
    let previousId;
    const safeJoin = currentId => {
 console.log("currentId ", currentId);
      socket.leave(previousId);
      socket.join(currentId);
      previousId = currentId;
    };
    socket.on('adduser', function(username){
      // store the username in the socket session for this client
      //socket.username = username;
      // add the client's username to the global list
      //usernames[username] = username;
      // send client to room 1
      console.log(username+' has connected to the server');
      // echo to client they've connected
    });
    socket.on("addgame",game=>{
 console.log("game ", game);
      games[game.id]=game
      safeJoin(game.id);
      io.emit("partida",games);
    })
    socket.on("siguienteturno",game=>{
 console.log("game turno sieguirnete ", game);
      games[game.id]=game
      io.emit("turno",game,);
    })
    socket.on("rendirce",game=>{
 console.log("game ", game);
      games[game["juego"]["id"]]=game["juego"]
      io.emit("rendicion",game.ganador);
    })
    socket.on("finjuego",game=>{
 console.log("game ", game);
      io.emit("final",game);
    })

  });
  app.listen(4444,()=>console.log("escuchando"))
  http.listen(4445);
  
 