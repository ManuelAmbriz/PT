
var express = require('express');

var bodyParser = require('body-parser');
var User = require("./models/user").User; // agarra todo lo que se pone en el exports 
var RedCamaras = require("./models/redcamaras").RedCamaras;
var router_app = require("./routers_app");
var router_userapp = require("./routers_userapp");
var router_appmovil = require("./routers_appmovil");
var session = require("express-session");
var session_middleware = require("./middleware/session");
var methodOverride = require("method-override");
var session_rol = require("./middleware/rol");
var session_movil = require("./middleware/movil");
//var RedisStore = require("connect-redis")(session);
var http = require("http");
var realtime = require("./realtime");
//var redis = require("redis");
var firebase = require("firebase");
var request = require('request'); 

var Raspberry = require("./models/raspberry").Raspberry;
var Sensor = require("./models/sensores").Sensor;
var NotificacionSensor = require("./models/notificacionessensores").Notificacionessensores
var Token = require("./models/token").Token

//var cliente = redis.createClient();

const port = process.env.PORT || 3000;
var app=express();
var server = http.Server(app);

app.use(express.static('public'));
  // Para moonglo 
//Shemas => tablas 
//Documentos => filas 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var config = {
    apiKey: "AIzaSyA9TjPrNfbYXKhke3fSJ5DLZg3PHBZ3ar8",
    authDomain: "neighbors-alertavecinal2.firebaseapp.com",
    databaseURL: "https://neighbors-alertavecinal2.firebaseio.com",
    projectId: "neighbors-alertavecinal2",
    storageBucket: "neighbors-alertavecinal2.appspot.com",
    messagingSenderId: "963293215266"
  };
firebase.initializeApp(config);

/*var sessionMiddleare = session({
    store: new RedisStore({}),
    secret:"super secret"
})*/

//realtime(server, sessionMiddleare);

app.use(session({
    secret: "AIzaSyA9TjPrNfbYXKhke3fSJ5DLZg3PHBZ3ar8",
    resave: false,
    saveUninitialized: false
}));
app.set("view engine", "jade");


app.get("/", function(req,res){
     res.render("index")
});
app.get("/AltaRed", function(req,res){
    User.find(function(err,doc){ // Si uno de los datos no viene nulo haz el doc 
        //console.log(doc);
        res.render("AltaRed", {hola : "Servidor de Camaras"})
    });
    
    
});
app.post("/user" , function(req,res){
    var user = new User ({nombre: req.body.nombre, correo: req.body.email, apellidopaterno:req.body.apellidopaterno, 
                         apellidomaterno: req.body.apellidomaterno, contraseña: req.body.contraseña, 
                         password_confirmation: req.body.password_confirmation, redcamaras: req.body.redcamaras, rol: req.body.rol, domicilio: req.body.domicilio, 
                         });
    console.log(user.password_confirmation)
    /*user.save(function(err, user, 1){ // Se guardan los archivos dentro de l base de datos con save 
        // a funcion save recibe como atributos un error, la tabla que va a guardar y l numero de tuplas que va a guardar 
       if(err){console.log(String(err));}
        res.send("Chingon");
    });//despues de que guardes has lo que esta aqui adentro */
    
    user.save().then(function(us){
        res.render("index", {hola : 'div class="alert alert-success"', hola2: 'Usuario Registrador Con Exito'})
    }, function(err){
        console.log(String(err));
       res.render("index", {hola : 'div class="alert alert-danger"', hola2: 'Error'})
    });
    
});

/*app.post("/altaredcamaras", function(req,res){
    
    var redcamaras = new RedCamaras ({ calle: req.body.calle, numeomax: req.body.numeomax, numeromin: req.body.numeromin, 
                                      colonia: req.body.colonia, ciudad: req.body.ciudad, estado: req.body.estado, cp: req.body.cp, participantes: req.body.participantes
        
    });
        redcamaras.save().then(function(us){
       res.send("Chingon"); 
    }, function(err){
        console.log(String(err));
        res.send("No Chingon :( ");
    });
    
});*/  



app.post("/sessions", function(req,res){
    console.log("Sessiones")
    User.findOne({correo: req.body.email, contraseña: req.body.contraseña}, function(err,user){
        if(err){res.render("index", {hola : 'div class="alert alert-danger"', hola2: 'Usuario o Contraseña Incorrectos'})}
        if(user == null){res.render("index", {hola : 'div class="alert alert-danger"', hola2: 'Usuario o Contraseña Incorrectos'})} 
        else {
            req.session.user_id = user._id;
            if(user.rol == "Administrador"){
                console.log("Aqui entro administrador")
                res.redirect("/app");
            } 
            else {
                console.log("Aqui entro Usuario")
                res.redirect("/userapp");
            }
        }
    }) ;
});

app.post("/sessionsapp", function(req,res){
    
    User.findOne({correo: req.body.email, contraseña: req.body.contraseña}, function(err,user){
      if(err){res.send("Error")}
        if(user == null){res.send("Error")} 
        else {
            req.session.user_id = user._id;
            //res.send(user);
            res.redirect("/appmovil");
        }
    }) ;
});

app.get("/pruebaalv", function(req,res){
    
    Token.find({user_id: "5a34c25961c1c00c559a56ab"}, function(err, tokens){ // Si se guardo exitosamente manda no
        if(err){res.send("error")}
            else {
                for (var tok  in tokens){
                    console.log("Token a enviar " + tokens[tok].token);
                }
                 
                res.send(tokens)
                 //enviarnotif(tokens.token, sensor.mensaje)

           }
    })
});


app.post("/sensorpir", function(req,res){
    if(req.body._idsensor != undefined){
        //res.send("Se activo el sensror");
        var ipAddress = req.connection.remoteAddress;
        console.log("Se Activo sensor  " + req.body._idsensor + " " + req.body._idraspberry);

        Raspberry.findOne({ip: req.body._idraspberry}, function(err, raspberry){
        if(err){res.redirect("/userapp");return;}   
            
            if(raspberry == null){console.log("No hay Raspberry registrados")}
            else{ 
                console.log("Raspberry encontrada " + raspberry)
                //////////////////////// Guardar Sensor Nuevo //////////////////////////////////
                Sensor.findOne({_idsensor: req.body._idsensor, raspberry_id: raspberry._id}).count(function(err, count){
                    if (count == 0){
                        var sensor = new Sensor ({raspberry_id: raspberry._id, _idsensor: req.body._idsensor, notificacion: "Activado", mensaje: req.body.mensaje});
                        sensor.save().then(function(us){
                            //res.send(sensor)
                        }, function(err){
                            res.send("Error");
                        });
                    }
                })
                    
                /////////////////////// Mandar notificacion /////////////////////////////////////////
                Sensor.findOne({_idsensor: req.body._idsensor, raspberry_id: raspberry._id, notificacion: "Activado"})
                    .populate("raspberry_id")// join user where user_id = user.usr_id
                    .exec(function(err, sensor){
                    if(sensor != null){
                        var fecha = new Date();
                        NotificacionSensor.findOne({sensor_id: sensor._id}).sort({_id: -1}).exec(function(err, notificacionessensores){
                            if (notificacionessensores != null){
                                var a = new Date (notificacionessensores.fecha);
                                var b = new Date();
                                var bstring = b.toString();
                                var c = ((b-a)/1000);
                                console.log("A: " + a + " B: " + bstring + " C: " + c + " id " + notificacionessensores._id)
                                if (c > 180) {// Si C es más grande a 3 min registra la notificación
                                    var notificacion = new NotificacionSensor({fecha: bstring , sensor_id: sensor._id, titulo: req.body._idsensor, mensaje: req.body.mensaje});
                                    notificacion.save().then(function(us){
                                        console.log("UserId " + raspberry.user_id)
                                        Token.find({user_id: raspberry.user_id}, function(err, tokens){ // Si se guardo exitosamente manda no
                                            if(err){res.send("error")}
                                            else {
                                                for (var tok in tokens){
                                                    console.log("Token a enviar " + tokens[tok].token)
                                                    enviarnotif(tokens[tok].token, sensor.mensaje)
                                                }   
                                            }
                                        })
                                        
                                    }, function(err){
                                        res.send("Error");
                                    });
                                }
                            } 
                            else {
                                var b = new Date();
                                var bstring = b.toString(); 
                                var notificacion = new NotificacionSensor({fecha: bstring , sensor_id: sensor._id, titulo: req.body._idsensor, mensaje: req.body.mensaje});
                                    notificacion.save().then(function(us){
                                        //res.send(sensor)
                                    }, function(err){
                                        res.send("Error");
                                    });
                            }
                        })
                    }
                })
                
                

            }
        })
    }
    
})


function enviarnotif (token, mensaje){
    console.log("Token que llega " +  token)
    
    var serverKey = "AAAA4Ei_-iI:APA91bFwpVGixDixIVwcQZwlbEavPuHW4Xci6dUmXnDBSOJ3YJpFyQG2agJ2KGQTNfR-ZOOHyUBJk2jBQ1P31YoD-4P8G8VGIs5YRcLV14shoBeSzEmHMfxzmrhfEl2LIrXJl_bDrL9p";
    var clientToken= token
 

    var options = {
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'Authorization': 'key=' + serverKey, "Content-Type": "application/json", "project_id":"neighbors-alertavecinal2"
      },
      json:  {"to" : token, "notification" : {"body" : mensaje,  "sound" : "default"},"data" : {"nombre" : "Manuel Ambriz", "edad" : "22"}}
      
    };

    request.post(options, function optionalCallback(err, httpResponse, body) {

      if (err) {
        return console.error('ERROR - FIREBASE POST failed:', err);
      }

     console.log("Token Enviado Correctamente")

    });
}


app.use(methodOverride("_method"))
app.use("/app", session_middleware);
app.use("/app", router_app);

app.use("/userapp", session_rol);
app.use("/userapp", router_userapp);

app.use("/appmovil", session_movil);
app.use("/appmovil", router_appmovil);
server.listen(port,function(){
    console.log('Servidor web iniciado' + ' listening on *:' + port);
});

