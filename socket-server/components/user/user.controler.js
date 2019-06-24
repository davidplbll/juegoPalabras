'use strict'
var usersEspera=[];
var localStorage=require('localStorage')
var palabras=require('./data');

function publicateFile(req, res) {

        // Hash file for name
        imageHash.hash(req.file.buffer, 8).then((hash) => {
            var fileName = "" + req.body.name + '.' + req.file.originalname.split('.').pop();
            // FileName is hash plus time plus original file extension
            //fileName = hash.hash + moment.now() + '.' + fileName.split('.').pop()
            var data=JSON.parse(localStorage.getItem("data"))
            let image={name:req.body.name,date:moment().format("YYYY-MM-DD"),namefile:fileName}
            if(data){
                data["files"]=[...data["files"],image]
            }else{ 
                data={
                    files:[image]
                }
            }
            localStorage.setItem("data",JSON.stringify(data))
            fs.writeFileSync('./uploads/publications/' + fileName, req.file.buffer);
            res.status(200).send({Respuesta:"archivo guardado"})
            //log.responseInfo(res, 200,{Respuesta:"archivo guardado"},log.ERR_CODES.OK, 'Success');
        });
    
}


function getPublicationFile(req, res) {
    if (!req.params.file_name) log.response(res, 400, log.ERR_CODES.MISSING_PARAMETER, 'The file_name is obligatory');
    else res.sendFile(path.resolve('./uploads/publications/' + req.params.file_name, ), {}, (err) => {
        if (err) log.response(res, 404, log.ERR_CODES.INVALID_PARAMETER, 'File Not Found');
    });
}

function verifyFile(req,res) {
    var data=JSON.parse(localStorage.getItem("data"))
    if(data){
        for(let image of data["files"]){
            if(image["name"]==req.body.name)
                res.status(200).send({Respuesta:"existe",imagen:image})
        }
    }
    res.status(200).send({Respuesta:"no existe"})
}

function login(req,res) {
    let enviado=false
    var name=req.body.usuario;
    var pass=req.body.contrasenia;
    var data=JSON.parse(localStorage.getItem("data"))
    if(data){
        for(let user of data["users"]){
            if(user["user"]==name && user["pass"]==pass){
                enviado=true;
                res.status(200).send({Respuesta:"existe",user:user})
            }
        }
        if(!enviado){
            res.status(200).send({Respuesta:"no existe"})
        }
    }else{
        res.status(200).send({Respuesta:"no existe"})
    }
}
function register(req,res) {
    var name=req.body.usuario;
    var pass=req.body.contrasenia;
    var id=req.body.id;
    var user={user:name,pass:pass,juegos:[],id:id};
    var data=JSON.parse(localStorage.getItem("data"))
    if(data){
        data["users"]=[...data["users"],user]
    }else{
        data={users:[user]}
    }
    localStorage.setItem("data",JSON.stringify(data))
    res.status(200).send({Respuesta:"registrado",user:user})
}

function iniciarJuego(req,res){
    let usuario=req.body;
    if(usersEspera.length==0){
        usersEspera=[usuario]
        res.status(200).send({Respuesta:"esperando"})
    }else if(usersEspera.length==1){
        usersEspera=[...usersEspera,usuario]
        let jugadores=usersEspera;
        usersEspera=[]
        res.status(200).send({Respuesta:"iniciar",jugadores:jugadores})
    }
}
function palabrainicial(req,res){
    res.status(200).send({palabra:getPalabra(null)})
}
function palabrarandom(req,res){
    res.status(200).send({palabra:getPalabra(req.letra)})
}
function validar(req,res){
    if(req.body.respuesta==req.body.palabra)res.status(200).send({puntaje:req.body.palabra.length})
    else res.status(200).send({puntaje:0})
}
function rendirce(req,res){
    let juego=req.body.juego
    let actual=req.body.user;
    let ganador;
    for(let user of juego.jugadores){
        if(user["id"]!=actual["id"]){
            ganador=user
        }
    }
    res.status(200).send({ganador:ganador})

}
function finjuego(req,res){
    let juego=req.body.juego
    let actual=req.body.user;
    let ganador;
    let data={}
    for(let palabra of juego.palabras){
        data[palabra.jugador]=(data[palabra.jugador])?palabra.puntaje:data[palabra.jugador]+palabra.puntaje;
    }
    let puntaje=0
    let id=""
    for (let key of Object.keys(data)){
        if(data[key]>puntaje){
            puntaje=data[key]
            id=key;
        }
    }
    if(puntaje==0)ganador="empate"
    else for(let jugador of juego.jugadores){if (jugador["id"]==id)ganador=jugador}
    res.status(200).send({ganador:ganador})
}

function getPalabra(letras) {
    let data=palabras.getdata();
    if (!letras) return data[Math.floor(Math.random()*data.length)];
    let palabrasPosibles=data.filter(
        word=>{
            if(String(word).indexOf(letras))return true
            else return false;
        }
    )
    return palabrasPosibles[Math.floor(Math.random()*palabrasPosibles.length)];
}


module.exports = {
    login,
    register,
    iniciarJuego,
    palabrainicial,
    validar,
    palabrarandom,
    rendirce,
    finjuego
};