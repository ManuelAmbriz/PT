var express = require('express');
var RedCamaras = require("./models/redcamaras").RedCamaras;
var router = express.Router();
var User = require("./models/user").User;
var SolicitudUnirse = require("./models/solicitudunirse").SolicitudUnirse;
var RedCamaras_finder = require("./middleware/find_redcamaras");
var Users_finder = require("./middleware/find_user");
var Solicitud_finder = require("./middleware/find_solicitudcrear");
var camaras_finder = require("./middleware/find_camara");
var Camaras = require("./models/camaras").Camaras;
var Notificaciones = require("./models/notificaciones").Notificaciones;
var Token = require("./models/token").Token;
var Raspberry = require("./models/raspberry").Raspberry;
var Sensor = require("./models/sensores").Sensor;
var NotificacionSensor = require("./models/notificacionessensores").Notificacionessensores
var request = require('request'); 
router.get("/", function(req,res){
    res.render("userapp/home")
});

var SolictudesXUsuario = function(req,res){ SolicitudUnirse.find({user_id: res.locals.user._id}).count(function(err, count){
    if(err){res.redirect("/userapp");return;}    
    res.render("userapp/redescamaras/index", {redcamaras:redcamaras}) 
    })
};

router.get("/redescamaras/new", function(req,res){
    res.render("userapp/redescamaras/AltaRed")
    
});

router.get("/redescamaras/vercam", function(req,res){
    //res.render("userapp/redescamaras/AltaRed")
    console.log(req.params.id)
    SolicitudUnirse.find({estatus: "Aprobado", user_id:res.locals.user._id})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
        if(err){res.redirect("/userapp");return}
        console.log(solicitudunirse)
        res.render("userapp/redescamaras/verred", {solicitudunirse:solicitudunirse, user_id: res.locals.user._id.toString()})
        
    })
});

router.all("/redescamaras/:id*", RedCamaras_finder)

router.get("/redescamaras/:id/edit", function(req,res){

    res.render("userapp/redescamaras/edit");   
});

router.route("/redescamarasd/:id")

    .delete(function(req,res){
        SolicitudUnirse.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/userapp/redescamaras/vercam")}
            else{
                res.redirect("/userapp/");
            }
                              
        })
    });

router.route("/redescamarasd/:id")

    .delete(function(req,res){
        SolicitudUnirse.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/app/redescamaras/")}
            else{
                res.redirect("/app/");
            }
                              
        })
    });


router.route("/redescamaras/:id")
    .get(function(req, res){       
    res.render("userapp/redescamaras/show");    
})
    .put(function(req,res){

    //res.send(redcamaras) res.locals = {redcamaras:redcamaras}
        res.locals.redcamaras.calle= req.body.calle; 
        res.locals.redcamaras.numeromax= req.body.numeromax; 
        res.locals.redcamaras.numeromin= req.body.numeromin; 
        res.locals.redcamaras.colonia= req.body.colonia;
        res.locals.redcamaras.ciudad= req.body.ciudad; 
        res.locals.redcamaras.estado= req.body.estado; 
        res.locals.redcamaras.cp= req.body.cp; 
        res.locals.redcamaras.participantes= req.body.participantes;
        res.locals.redcamaras.save().then(function(us){
            res.render("userapp/redescamaras/show")  
            }, function(err){
                res.render("userapp/redescamaras/"+req.params.id+"/edit")  
             }); 

    
})
    .delete(function(req,res){
        RedCamaras.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/userapp/redescamaras/")}
            else{
                res.redirect("/userapp/redescamaras/show/"+req.params.id);
            }
                              
        })
    });

router.route("/redescamaras")
    .get(function(req, res){
    RedCamaras.find({user_id: res.locals.user._id}, function(err, redcamaras){
    if(err){res.redirect("/userapp");return;}    
    res.render("userapp/redescamaras/index", {redcamaras:redcamaras})    
    });
    
})
    .post(function(req,res){
    console.log(res.locals.user._id);
  var redcamaras = new RedCamaras ({ calle: req.body.calle, numeromax: req.body.numeromax, numeromin: req.body.numeromin, 
                                      colonia: req.body.colonia, ciudad: req.body.ciudad, estado: req.body.estado, cp: req.body.cp, participantes: req.body.participantes, user_id: res.locals.user._id, estatus:"Pendiente"
        
    });
        redcamaras.save().then(function(us){
       res.redirect("/userapp/redescamaras/"); 
    }, function(err){
        console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
    
    
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/solicitud/new", function(req,res){
    
    RedCamaras.find({estatus:"Aprobado", user_id:{$nin: [res.locals.user._id]}})
        .populate("user_id")
        .exec (function(err, redcamaras){
    if(err){res.redirect("/userapp");return;}    
    res.render("userapp/solicitud/new", {redcamaras:redcamaras})    
    });
    
});
//router.all("/solicitud/:id*", Solicitud_finder)

/*router.get("/solicitud/:id/edit", function(req,res){

    res.render("app/solicitud/edit")   

});*/

router.route("/solicitudu/:id")
    .get(function(req, res){
    SolicitudUnirse.findById(req.params.id)
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, solicitudunirse){
    if(err){res.redirect("/userapp");return;}    
    res.render("userapp/solicitudu/show", {solicitudunirse: solicitudunirse})    
    });
    
})

router.route("/solicitud/:id")
    .get(function(req, res){
    SolicitudUnirse.find({redcamaras_id: req.params.id, estatus:"Pendiente"})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, solicitudunirse){
    if(err){res.redirect("/userapp");return;}    
    res.render("userapp/solicitud/show", {solicitudunirse: solicitudunirse})    
    });
    
})
    .put(function(req,res){
        SolicitudUnirse.findById(req.params.id)
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, solicitudunirse){
            solicitudunirse.mensaje = solicitudunirse.mensaje;
            solicitudunirse.user_id = solicitudunirse.user_id;
            solicitudunirse.redcamaras_id = solicitudunirse.redcamaras_id;
            solicitudunirse.estatus= "Aprobado";
            
            solicitudunirse.save(function(err){
                    if(err){res.redirect("/userapp");return;}    
                    console.log(solicitudunirse);
                    res.redirect("/userapp/redescamaras")   
                })
        })

})
    .post(function(req,res){
    console.log("La red de camaras sera la :"+req.params.id);
     SolicitudUnirse.find({user_id: res.locals.user._id})
         .count(function(err, count){
            if(err){res.redirect("/userapp");return;}    
                if(count == 0){
                       var solicitudunirse = new SolicitudUnirse ({ estatus: "Pendiente", user_id: res.locals.user._id, redcamaras_id: req.params.id
                         });

                    solicitudunirse.save().then(function(us){
                    res.redirect("/userapp/solicitud/"); 
                    }, function(err){
                        console.log(String(err));
                        res.send("No Chingon :( " + err);
                    }); 
                }
                else 
                    {
                         SolicitudUnirse.find({user_id: res.locals.user._id})
                            .populate("user_id")// join user where user_id = user.usr_id
                            .populate("redcamaras_id")
                            .exec(function(err, solicitudunirse){
                        if(err){res.redirect("/userapp");return;}  
                            console.log(solicitudunirse);
                        res.render("userapp/solicitud/index", {solicitudunirse: solicitudunirse, hola : 'div class="alert alert-danger"', hola2: 'Usuario ya con registrado en una Red o con una Solicitud Pendiente'})  
                         })
                    }
            });
       
    
    
})
    .delete(function(req,res){
        SolicitudUnirse.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/userapp/solicitud/")}
            else{
                res.redirect("/userapp/solicitud/show/"+req.params.id);
            }
                              
        })
    });


router.route("/solicitudes")
    .get(function(req,res){
    RedCamaras.findOne({user_id: res.locals.user._id}, function(err, redcamara){
        if (!err){
             SolicitudUnirse.find({redcamaras_id: redcamara, estatus:"Pendiente"})
                .populate("user_id")// join user where user_id = user.usr_id
                .populate("redcamaras_id")
                .exec(function(err, solicitudunirse){
            if(err){res.redirect("/userapp");return;}    
            res.render("userapp/solicitud/show", {solicitudunirse: solicitudunirse})    
            });
        }else{res.redirect("/userapp"); return}
    })
   
    
     
});


router.route("/solicitud")
    .get(function(req, res){
    SolicitudUnirse.find({user_id: res.locals.user._id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, solicitudunirse){
    if(err){res.redirect("/userapp");return;}  
        console.log(solicitudunirse);
    res.render("userapp/solicitud/index", {solicitudunirse: solicitudunirse})    
    });
    
})
    .post(function(req,res){
  var redcamaras = new RedCamaras ({ calle: req.body.calle, numeromax: req.body.numeromax, numeromin: req.body.numeromin, 
                                      colonia: req.body.colonia, ciudad: req.body.ciudad, estado: req.body.estado, cp: req.body.cp, participantes: req.body.participantes
        
    });
        redcamaras.save().then(function(us){
       res.redirect("/app/solicitud/"+redcamaras._id) 
    }, function(err){
        console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
    
    
});




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/camaras/new", function(req,res){
    SolicitudUnirse.find({estatus: "Aprobado", user_id:res.locals.user._id})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
            if(err){res.redirect("/userapp");return;}    
            res.render("userapp/camaras/new", {solicitudunirse:solicitudunirse});
    });
        
});

//router.all("/camaras/:id*", camaras_finder)

router.get("/camaras/:id/edit", function(req,res){

    res.render("userapp/camaras/edit")   

});

router.route("/camaras/:id")
    .get(function(req, res){
    Camaras.find({redcamaras_id:req.params.id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, camaras){
    if(err){res.redirect("/userapp");return;}  
        console.log(camaras);
    res.render("userapp/camaras/index", {camaras: camaras})    
    });
    
})
    .put(function(req,res){

        //res.send(redcamaras) res.locals = {redcamaras:redcamaras}
        res.locals.user.nombre= req.body.nombre; 
        res.locals.user.apellidopaterno= req.body.apellidopaterno; 
        res.locals.user.apellidomaterno= req.body.apellidomaterno; 
        res.locals.user.correo= req.body.email; 
        res.locals.user.contraseña= req.body.contraseña; 
        res.locals.user.save().then(function(us){
            res.render("userapp/camaras/show")  
                    }, function(err){
                        res.render("userapp/camaras/"+req.params.id+"/edit")  
                     }); 
    
})
    .delete(function(req,res){
    Camaras.findById({_id: req.params.id}, function(err,camara){
        if(!err){
            Camaras.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/userapp/camaras/"+camara.redcamaras_id)}
            else{
                res.redirect("/userapp");
            }
        })
      }
       else {res.redirect("/userapp");} 
    })

})
        .post(function(req,res){
    console.log(req.params.id)
        var camaras = new Camaras ({ ip: req.body.ip , user_id: res.locals.user._id, redcamaras_id: req.params.id, numeroex: req.body.numeroex
         });
    
    camaras.save().then(function(us){
    res.redirect("/userapp/camaras/"+req.params.id); 
    }, function(err){
        console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
});
 

router.route("/camaras")
.get(function(req, res){
   res.redirect("/userapp/redescamaras/vercam")
})
    .post(function(req,res){
    Camaras.find({})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, camaras){
    if(err){res.redirect("/userapp");return;}  
        console.log(camaras);
    res.render("userapp/camaras/index", {camaras: camaras})    
    });
     
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get("/camaras/new", function(req,res){
    SolicitudUnirse.find({estatus: "Aprobado", user_id:res.locals.user._id})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
            if(err){res.redirect("/userapp");return;}    
            res.render("userapp/camaras/new", {solicitudunirse:solicitudunirse});
    });
        
});

//router.all("/camaras/:id*", camaras_finder)

router.get("/camaras/:id/edit", function(req,res){

    res.render("userapp/camaras/edit")   

});

router.route("/camaras/:id")
    .get(function(req, res){
    Camaras.find({redcamaras_id:req.params.id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, camaras){
    if(err){res.redirect("/userapp");return;}  
        console.log(camaras);
    res.render("userapp/camaras/index", {camaras: camaras})    
    });
    
})
    .put(function(req,res){

        //res.send(redcamaras) res.locals = {redcamaras:redcamaras}
        res.locals.user.nombre= req.body.nombre; 
        res.locals.user.apellidopaterno= req.body.apellidopaterno; 
        res.locals.user.apellidomaterno= req.body.apellidomaterno; 
        res.locals.user.correo= req.body.email; 
        res.locals.user.contraseña= req.body.contraseña; 
        res.locals.user.save().then(function(us){
            res.render("userapp/camaras/show")  
                    }, function(err){
                        res.render("userapp/camaras/"+req.params.id+"/edit")  
                     }); 
    
})
    .delete(function(req,res){
    Camaras.findById({_id: req.params.id}, function(err,camara){
        if(!err){
            Camaras.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/userapp/camaras/"+camara.redcamaras_id)}
            else{
                res.redirect("/userapp");
            }
        })
      }
       else {res.redirect("/userapp");} 
    })

})
        .post(function(req,res){
    console.log(req.params.id)
        var camaras = new Camaras ({ ip: req.body.ip , user_id: res.locals.user._id, redcamaras_id: req.params.id, numeroex: req.body.numeroex
         });
    
    camaras.save().then(function(us){
    res.redirect("/userapp/camaras/"+req.params.id); 
    }, function(err){
        console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
});
 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/notificaciones/new", function(req,res){
    SolicitudUnirse.find({estatus: "Aprobado", user_id:res.locals.user._id})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
            if(err){res.redirect("/userapp");return;}    
            res.render("userapp/notificaciones/new", {solicitudunirse:solicitudunirse});
    });
        
});

router.route("/notificaciones")
.get(function(req, res){
    SolicitudUnirse.findOne({estatus: "Aprobado", user_id:res.locals.user._id}, function(err, idredvecional){
    if(idredvecional != null){
    
   Notificaciones.find({})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .sort({_id: -1})
        .exec(function(err, notificaciones){
    if(err){res.redirect("/userapp");return;}  
      else {
          
          console.log("Notificaciones " + notificaciones);
       Raspberry.find({user_id: res.locals.user._id}, function(err,raspberry){
           if(!err){
               if(raspberry != ""){
                   for(var ras in raspberry){
                       Sensor.find({raspberry_id: raspberry[ras]._id}, function(err, sensor){
                           if(sensor != ""){
                            if(!err){
                                for (var sen in sensor){
                                   NotificacionSensor.find({sensor_id: sensor[sen]._id}).sort({_id: -1}).exec(function(err,notificacionsensor){
                                   if(err){res.redirect("/userapp");return;}
                                    res.render("userapp/notificaciones/index", {notificaciones: notificaciones, notificacionsensor: notificacionsensor})
                                   }) 
                                }

                            }  
                       }
                       })
                   }
            }
               else {
                    res.render("userapp/notificaciones/index", {notificaciones: notificaciones, notificacionsensor: ""})
               }
           }
       })   
    }
    });
}
        else{
            res.render("userapp/notificaciones/index", {notificaciones: [], notificacionsensor: []})
        }
})
})
  /*  .post(function(req,res){
    Notificaciones.find({})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, notificaciones){
    if(err){res.redirect("/userapp");return;}  
        console.log(notificaciones);
    res.render("userapp/notificaciones/index", {notificaciones: notificaciones})    
    });
     
})*/;

router.route("/notificaciones/:id")
    .get(function(req, res){
    Camaras.find({redcamaras_id:req.params.id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, camaras){
    if(err){res.redirect("/userapp");return;}  
        console.log(camaras);
    res.render("userapp/camaras/index", {camaras: camaras})    
    });
    
})

    .delete(function(req,res){
    Camaras.findById({_id: req.params.id}, function(err,camara){
        if(!err){
            Camaras.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/userapp/camaras/"+camara.redcamaras_id)}
            else{
                res.redirect("/userapp");
            }
        })
      }
       else {res.redirect("/userapp");} 
    })

})
        .post(function(req,res){
        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var f=new Date();
        var fecha = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()
        var notificaciones = new Notificaciones ({ titulo: req.body.titulo , user_id: res.locals.user._id, redcamaras_id: req.params.id, mensaje: req.body.mensaje, fecha: fecha
         });
    
    notificaciones.save().then(function(us){
       
        Token.find({redcamaras_id:req.params.id}, function(err, tokens){
            if(err){res.send("error")}
           
            else {
                 var mensaje = res.locals.user.nombre + " " + res.locals.user.apellidopaterno + " : " + req.body.mensaje;
                 for (var tok in tokens){

                  enviarnotif(tokens[tok].token, mensaje)
                 }   
            }
        })
    res.redirect("/userapp/notificaciones/"); 
    }, function(err){
        console.log(String(err));
        res.send("Error en el servidor " + err);
    });   
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.route("/token")
    .post(function(req,res){
      
        var token = new Token ({token: req.body.token, user_id: res.locals.user._id , redcamaras_id: req.body.redcamaras_id,  });

        token.save().then(function(us){
            res.send(user);
        }, function(err){
            console.log(String(err));
            res.send("No Chingon :( ");
        });

});


router.route("/token/:id")
    .get(function(req, res){
    Token.find({redcamaras_id:req.params.id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, tokens){
    if(err){res.send("error");return;}  
        console.log(tokens);
    res.send({tokens: tokens})    
    });
    
})

router.route("/tokencheck/:id")
    .get(function(req, res){
    Token.findOne({_id:req.params.id}, function(err, token){
    if(err){res.send("0");return;}  
        console.log(token);
    if(token == null ){res.send("0")}
    else {res.send({tokens: tokens})}   
    });
    
})


router.get("/alltokenkeyalv", function(req,res){
   Token.find({}, function(err, tokenall){
       if(err){res.send("error")}
       res.send({tokenall: tokenall})
   }) 
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/sensor/new", function(req,res){   
        res.render("userapp/sensores/new");
        
});

router.route("/sensores")
.get(function(req, res){
   Raspberry.find({user_id: res.locals.user._id})
        .populate("user_id")// join user where user_id = user.usr_id
        .exec(function(err, raspberry){
    if(err){res.redirect("/userapp");return;}  
    res.render("userapp/sensores/index", {raspberry: raspberry})    
    });
})
    .post(function(req,res){
  
     Raspberry.find({ip: req.body.ip})
         .count(function(err, count){
            if(err){res.redirect("/userapp");return;}    
                if(count == 0){
                      var raspberry = new Raspberry ({ip: req.body.ip, user_id: res.locals.user._id});
                        raspberry.save().then(function(us){
                            res.redirect("/userapp/sensores")
                        }, function(err){
                            console.log(String(err));
                            res.send("No Chingon :( ");
                        });
                }
                else 
                    {
                        res.send("Usuario ya con registrado en una Red o con una Solicitud Pendiente");
                    }
            });

});

router.route("/sensores/:id")
    .get(function(req, res){
    Camaras.find({redcamaras_id:req.params.id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, camaras){
    if(err){res.redirect("/userapp");return;}  
        console.log(camaras);
    res.render("userapp/camaras/index", {camaras: camaras})    
    });
    
})

    .delete(function(req,res){
        Raspberry.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
                Sensor.find({raspberry_id: req.params.id}, function (err, sensores){
                    if (!err) {
                        if(sensores != ""){
                        for (var sen in sensores){
                            NotificacionSensor.find({sensor_id: sensores[sen]._id}).remove(function(err){
                                    Sensor.find({raspberry_id: req.params.id}).remove(function(err){
                                         if(!err){
                                            console.log("Token Eliminado")
                                             res.send("Eliminado el Sensor")}
                                            else{
                                                res.send("Error")
                                            }
                                    })
                                 res.redirect("/userapp/sensores")
                                
                            })
                        }
                    }
                        else{res.redirect("/userapp/sensores")}
                    }
                })
                
            }
            else{
                res.redirect("/userapp");
            }
        })
})
        .post(function(req,res){
        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var f=new Date();
        var fecha = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()
        var notificaciones = new Notificaciones ({ titulo: req.body.titulo , user_id: res.locals.user._id, redcamaras_id: req.params.id, mensaje: req.body.mensaje, fecha: fecha
         });
    
    notificaciones.save().then(function(us){
        res.send(notificaciones)
    res.redirect("/userapp/notificaciones/"); 
    }, function(err){
        console.log(String(err));
        res.send("Error en el servidor " + err);
    });   
});

router.post("/quitarnotificacionessensores", function(req, res){
        Raspberry.find({user_id: res.locals.user._id}, function(err, raspberry){
            for (var rasp in raspberry){
                Sensor.find({raspberry_id: raspberry[rasp]._id}, function(err, sensores){
                    for (var sen in sensores){
                        sensores[sen].ip =  sensores[sen].ip
                        sensores[sen]._idsensor = sensores[sen]._idsensor
                        sensores[sen].notificacion = req.body.notificacion
                        sensores[sen].mensaje = sensores[sen].mensaje
                        sensores[sen].raspberry_id =  sensores[sen].raspberry_id 

                        sensores[sen].save().then(function(us){
                           res.send("Notificaciones de los Sensores " + req.body.notificacion); 
                        }, function(err){
                            console.log(String(err));
                            res.send("No Chingon :( " + err);
                        });  
                    }
                    
                })      
            }
        })
})

router.get("/estatusdesensores", function(req, res){
        Raspberry.find({user_id: res.locals.user._id}, function(err, raspberry){
            if(raspberry != ""){
                for (var rasp in raspberry){
                    Sensor.findOne({raspberry_id: raspberry[rasp]._id}, function(err, sensores){
                        console.log("estatussensores " + sensores)
                        if (sensores != null){
                        res.send(sensores.notificacion)}
                        else{res.send("Error")}
                    })      
                }
            }
            else {res.send("Error")}
        })
})

router.get("/allraspberryalv", function(req, res){
   Raspberry.find({}, function(err,sensores){
       if(err){res.redirect("/userapp");return;}
       res.send(sensores)
   })  
});

router.get("/allsensores", function(req, res){
   Sensor.find({}, function(err,sensores){
       if(err){res.redirect("/userapp");return;}
       res.send(sensores)
   }) 
});

router.get("/allnotificacionessensoresalv", function(req, res){
   NotificacionSensor.find({}, function(err,sensores){
       if(err){res.redirect("/userapp");return;}
       res.send(sensores)
   })  
});

router.get("/vaciarsensoressalv", function(req,res){
  Sensor.find({}).remove(function(err){
            if(!err){
            console.log("Token Eliminado")
             res.send("Eliminado el Sensor")}
            else{
                res.send("Error en alguna mamada")
            }
                              
        })
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function enviarnotif (token, mensaje){
    console.log("Token que llega " +  token)
    
    var serverKey = "AAAA4Ei_-iI:APA91bFwpVGixDixIVwcQZwlbEavPuHW4Xci6dUmXnDBSOJ3YJpFyQG2agJ2KGQTNfR-ZOOHyUBJk2jBQ1P31YoD-4P8G8VGIs5YRcLV14shoBeSzEmHMfxzmrhfEl2LIrXJl_bDrL9p";
    var clientToken= token
 

    var options = {
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        'Authorization': 'key=' + serverKey, "Content-Type": "application/json", "project_id":"neighbors-alertavecinal2"
      },
      json:  {"to" : token, "notification" : {"body" : mensaje, "sound" : "default"},"data" : {"nombre" : "Manuel Ambriz", "edad" : "22"}}
      
    };

    request.post(options, function optionalCallback(err, httpResponse, body) {

      if (err) {
        return console.error('ERROR - FIREBASE POST failed:', err);
      }

     console.log("Token Enviado Correctamente")

    });
}

module.exports = router;