var express = require('express');
var RedCamaras = require("./models/redcamaras").RedCamaras;
var router = express.Router();
var User = require("./models/user").User;
var SolicitudUnirse = require("./models/solicitudunirse").SolicitudUnirse;
var RedCamaras_finder = require("./middleware/find_redcamaras");
var Users_finder = require("./middleware/find_user");
var Solicitud_finder = require("./middleware/find_solicitudcrear");
var Camaras = require("./models/camaras").Camaras;
var Notificaciones = require("./models/notificaciones").Notificaciones;
var Token = require("./models/token").Token;
var Raspberry = require("./models/raspberry").Raspberry;
var Sensor = require("./models/sensores").Sensor;
var NotificacionSensor = require("./models/notificacionessensores").Notificacionessensores
router.get("/", function(req,res){
    ////console.log(res.locals.user._id)
    res.send(res.locals.user)
    //res.render("app/home", {user: User})
});

router.get("/profile", function(req,res){
    ////console.log(res.locals.user._id)
    res.send(res.locals.user)
    //res.render("app/home", {user: User})
});

router.get("/redescamaras/new", function(req,res){
    res.render("app/redescamaras/AltaRed")
    
});

router.all("/redescamaras/:id*", RedCamaras_finder)

router.get("/redescamaras/:id/edit", function(req,res){
    res.render("app/redescamaras/edit");   
});

router.route("/redescamaras/:id/users")
    .get(function(req,res){
    ////console.log(req.params.id)
    SolicitudUnirse.find({estatus:"Aprobado", redcamaras_id: req.params.id, user_id:{$nin: [res.locals.user._id]}})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
        if(err){res.redirect("/app");return}
        res.send({solicitudunirse:solicitudunirse})
        
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
    res.render("app/redescamaras/show");    
})
    .put(function(req,res){

        var solicitudunirse = new SolicitudUnirse ({ estatus: "Aprobado", user_id: res.locals.redcamaras.user_id, redcamaras_id: res.locals.redcamaras._id

        });
            solicitudunirse.save().then(function(us){
           //console.log("Aqui se puede modificar ")
    //res.send(redcamaras) res.locals = {redcamaras:redcamaras}
        res.locals.redcamaras.calle= res.locals.redcamaras.calle; 
        res.locals.redcamaras.numeromax= res.locals.redcamaras.numeromax; 
        res.locals.redcamaras.numeromin= res.locals.redcamaras.numeromin; 
        res.locals.redcamaras.colonia= res.locals.redcamaras.colonia;
        res.locals.redcamaras.ciudad= res.locals.redcamaras.ciudad; 
        res.locals.redcamaras.estado= res.locals.redcamaras.estado; 
        res.locals.redcamaras.cp= res.locals.redcamaras.cp; 
        res.locals.redcamaras.participantes= res.locals.redcamaras.participantes;
        res.locals.redcamaras.estatus = "Aprobado";
        res.locals.redcamaras.save().then(function(us){
            res.render("app/redescamaras/show")  
            }, function(err){
            
                SolicitudUnirs.findOneANdRemove({estatus: "Aprobado", user_id: res.locals.redcamaras.user_id, redcamaras_id: res.locals.redcamaras._id}, function(err){
                    if(!err){
                        //Se aprobo la Red y se creo solicitud 
                        //console.log("Problema al aprobar la red ")
                        res.render("app/redescamaras/"+req.params.id)
                    }
                    
                })                
             });                     
            }, function(err){
            //console.log(String(err));
            res.send("Error al aprobar la Red Intentelo mas tarde" + err);
        });   


    
})
    .delete(function(req,res){
        RedCamaras.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/app/redescamaras/")}
            else{
                res.redirect("/app/redescamaras/show/"+req.params.id);
            }
                              
        })
    });

router.route("/redescamaras")
    .get(function(req, res){
    //console.log("Aqui entro en le redcamaras movil")
    SolicitudUnirse.find({estatus: "Aprobado", user_id:res.locals.user._id})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
        if(err){res.redirect("/userapp");return}
        res.send({solicitudunirse:solicitudunirse})  
      
        
    })
})
    .post(function(req,res){
    ////console.log(res.locals.user._id);
  var redcamaras = new RedCamaras ({ calle: req.body.calle, numeromax: req.body.numeromax, numeromin: req.body.numeromin, 
                                      colonia: req.body.colonia, ciudad: req.body.ciudad, estado: req.body.estado, cp: req.body.cp, participantes: req.body.participantes, user_id: res.locals.user._id, estatus:req.body.estatus, notificaciones:"false"
        
    });
        redcamaras.save().then(function(us){
       res.redirect("/app/redescamaras/"); 
    }, function(err){
        //console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
    
    
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get("/solicitud/new", function(req,res){
    
    RedCamaras.find({estatus:"Aprobado", user_id:{$nin: [res.locals.user._id]}})
        .populate("user_id")
        .exec (function(err, redcamaras){
    if(err){res.redirect("/userapp");return;}    
    res.send( {redcamaras:redcamaras})    
    });
    
});

router.get("/removeredcamara", function(req,res){
    RedCamaras.find({_id: "5a4ea2e5dccd21577df748c4"}).remove(function(err){
        if(!err){
            res.send("Eliminado Red Camara")
        }
    })
})

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
    RedCamaras.findOne({user_id: res.locals.user._id}, function(err, redcamara){
        if (!err){
             SolicitudUnirse.find({redcamaras_id: redcamara, estatus:"Pendiente"})
                .populate("user_id")// join user where user_id = user.usr_id
                .populate("redcamaras_id")
                .exec(function(err, solicitudunirse){
            if(err){res.redirect("/userapp");return;}    
            res.send({solicitudunirse: solicitudunirse})      
            });
        }else{res.send("Error"); return}
    })
   
    
})
    .put(function(req,res){
    //console.log("AceptarSolicitud")
        SolicitudUnirse.findById(req.params.id)
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, solicitudunirse){
            solicitudunirse.mensaje = solicitudunirse.mensaje;
            solicitudunirse.user_id = solicitudunirse.user_id;
            solicitudunirse.redcamaras_id = solicitudunirse.redcamaras_id;
            solicitudunirse.estatus= "Aprobado";
            
            solicitudunirse.save(function(err){
                    if(err){res.send("Error");return;}    
                    ////console.log(solicitudunirse);
                    res.send("Desde ahora el usuario " + solicitudunirse.user_id.nombre + " "  + solicitudunirse.user_id.apellidopaterno + " estará en su Red" )  
                })
        })

})
    .post(function(req,res){
    //console.log("La red de camaras sera la :"+req.params.id);
     SolicitudUnirse.find({user_id: res.locals.user._id})
         .count(function(err, count){
            if(err){res.redirect("/userapp");return;}    
                //console.log("Count " + count)
                if(count == 0){
                       var solicitudunirse = new SolicitudUnirse ({ estatus: "Pendiente", user_id: res.locals.user._id, redcamaras_id: req.params.id
                         });

                    solicitudunirse.save().then(function(us){
                    res.send("Solicitud Enviada")
                    }, function(err){
                        //console.log(String(err));
                        res.send("No Chingon :( " + err);
                    }); 
                }
                else 
                    {
                        res.send("Usuario ya con registrado en una Red o con una Solicitud Pendiente");
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


router.route("/solicitudeliminar/:id")
    ////console.log("Eliminar solictud desde el movil")
    .post(function(req,res){
    //console.log("Eliminar solictud desde el movil")
     SolicitudUnirse.findOneAndRemove({user_id: res.locals.user._id}, function(err){
         if(!err){res.send("Se elimino la solicitud de ingreso a la Red")}
         else {res.send("Error")}
     });

});


router.route("/solicitud")
    .get(function(req, res){
    SolicitudUnirse.find({user_id: res.locals.user._id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, solicitudunirse){
    if(err){res.redirect("/userapp");return;}  
       // //console.log(solicitudunirse);
    res.send({solicitudunirse: solicitudunirse,user_id: res.locals.user._id.toString()})
         
    });
    
})
    .post(function(req,res){
  var redcamaras = new RedCamaras ({ calle: req.body.calle, numeromax: req.body.numeromax, numeromin: req.body.numeromin, 
                                      colonia: req.body.colonia, ciudad: req.body.ciudad, estado: req.body.estado, cp: req.body.cp, participantes: req.body.participantes
        
    });
        redcamaras.save().then(function(us){
       res.redirect("/app/solicitud/"+redcamaras._id) 
    }, function(err){
        //console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
    
    
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/user/new", function(req,res){
    res.render("app/user/AltaRed")
    
});
router.all("/redescamaras/:id*", Users_finder)

router.get("/user/:id/edit", function(req,res){

    res.render("app/user/edit")   

});

router.route("/user/:id")
    .get(function(req, res){       
        res.render("app/user/show")   

})
    .put(function(req,res){

        //res.send(redcamaras) res.locals = {redcamaras:redcamaras}
        res.locals.user.nombre= req.body.nombre; 
        res.locals.user.apellidopaterno= req.body.apellidopaterno; 
        res.locals.user.apellidomaterno= req.body.apellidomaterno; 
        res.locals.user.correo= req.body.email; 
        res.locals.user.contraseña= req.body.contraseña; 
        res.locals.user.save().then(function(us){
            res.render("app/user/show")  
                    }, function(err){
                        res.render("app/user/"+req.params.id+"/edit")  
                     }); 
    
})
    .delete(function(req,res){
    Camaras.find.remove(function(err){
        if(!err){
            Notificiaciones.find({user_id: req.params.id}).remove(function(err){
                if(!err){
                    RedCamaras.find({user_id: req.params.id}).remove(function(err){
                        if(!err){
                            SolicitudUnirse.find({user_id: req.params.id}).remove(function(err){
                                if(!err){
                                    Token.find({user_id: req.params.id}).remove(function(err){
                                        if(!err){
                                            User.findOneAndRemove({_id: req.params.id}, function(err){
                                            if(!err){
                                             res.redirect("/app/user/")}
                                            else{
                                                res.redirect("/app/user/show/"+req.params.id);
                                            }

                                        }) 
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
    
    
});

router.route("/user")
    .get(function(req, res){
    User.find({}, function(err, user){
    if(err){res.redirect("/app");return;}    
    res.render("app/user/index", {user: user})    
    });
    
})
    .post(function(req,res){
  var redcamaras = new RedCamaras ({ calle: req.body.calle, numeromax: req.body.numeromax, numeromin: req.body.numeromin, 
                                      colonia: req.body.colonia, ciudad: req.body.ciudad, estado: req.body.estado, cp: req.body.cp, participantes: req.body.participantes
        
    });
        redcamaras.save().then(function(us){
       res.redirect("/app/user/"+redcamaras._id) 
    }, function(err){
        //console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
    
    
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/redescamaras/vercam", function(req,res){
    //res.render("userapp/redescamaras/AltaRed")
    //console.log("Aqui entro en le redcamaras movil")
    SolicitudUnirse.find({estatus: "Aprobado", user_id:res.locals.user._id})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
        if(err){res.redirect("/userapp");return}
        res.send({solicitudunirse:solicitudunirse})  
      
        
    })
});

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
    Camaras.find({redcamaras_id: req.params.id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, camaras){
    if(err){res.redirect("/userapp");return;}  
        ////console.log(camaras);
    res.send({camaras: camaras})    
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
    //console.log(req.params.id)
        var camaras = new Camaras ({ ip: req.body.ip , user_id: res.locals.user._id, redcamaras_id: req.params.id, numeroex: req.body.numeroex
         });
    
    camaras.save().then(function(us){
    res.redirect("/userapp/camaras/"+req.params.id); 
    }, function(err){
        //console.log(String(err));
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
        ////console.log(camaras);
    res.render("userapp/camaras/index", {camaras: camaras})    
    });
     
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
           Notificaciones.find({redcamaras_id: idredvecional.redcamaras_id})
                .populate("user_id")// join user where user_id = user.usr_id
                .populate("redcamaras_id")
                .sort({_id: -1})
                .exec(function(err, notificaciones){
            if(err){res.send("Error");return;}  
              else {  
                  ////console.log("Notificaciones " + notificaciones);
               NotificacionSensor.find({user_id: res.locals.user._id}, function(err, notificacionsensor){
                   if(!err){
                       res.send({notificaciones: notificaciones, notificacionsensor: notificacionsensor})
                   }
               })   
            }
            });
    }
        else{
            NotificacionSensor.find({user_id: res.locals.user._id}, function(err, notificacionsensor){
                if(!err){
                    res.send({notificaciones: [], notificacionsensor: notificacionsensor})
                }
            })
        }
    })
})

router.route("/notificaciones/:id")
    .get(function(req, res){
    Camaras.find({redcamaras_id:req.params.id})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, camaras){
    if(err){res.redirect("/userapp");return;}  
        ////console.log(camaras);
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
    //console.log(req.params.id)
        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var f=new Date();
        var fecha = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear() + " " + f.getHours() + ":" + f.getMinutes()
        var notificaciones = new Notificaciones ({ titulo: req.body.titulo , user_id: res.locals.user._id, redcamaras_id: req.params.id, mensaje: req.body.mensaje, fecha: fecha
         });
    
    notificaciones.save().then(function(us){
        res.send("Alerta Vecinal Enviada")
   
    }, function(err){
        //console.log(String(err));
        res.send("Error en el servidor " + err);
    });   
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



/*router.route("/token")
    .get(function(req,res){
        var token = new Token ({token: req.body.token, user_id: res.locals.user._id , redcamaras_id: req.body.redcamaras_id,  });

        token.save().then(function(us){
            res.send(user);
        }, function(err){
            //console.log(String(err));
            res.send("No Chingon :( ");
        });

});*/

router.route("/token")
    .post(function(req,res){
          Token.find({token: req.body.token}).
          count(function(err, tokencount){
              if(err) res.send("Error")
              if(tokencount == 0) {
                   var token = new Token ({token: req.body.token, user_id: res.locals.user._id , redcamaras_id: req.body.redcamaras_id});
                        token.save().then(function(us){
                            res.send(token);
                        }, function(err){
                            //console.log(String(err));
                            res.send("No Chingon :( ");
                        });
               }
              else {   
                 Token.findOne({token: req.body.token})
                    .exec(function(err, tokencambiar){
                        tokencambiar.token = tokencambiar.token;
                        tokencambiar.user_id = res.locals.user._id;
                        tokencambiar.redcamaras_id = req.body.redcamaras_id
                        tokencambiar.save(function(err){
                                if(err){res.send("Error");return;}    
                                //console.log("Se cambio el Token por " + tokencambiar);
                                res.send("Token Cambiado")  
                            })
                    })
                
              }
          })
});

router.route("/redcamaranoti/:id")
.post(function(req,res){
    RedCamaras.findOne({_id: req.params.id}, function(err, redcamara){
        redcamara.calle= redcamara.calle; 
        redcamara.numeromax= redcamara.numeromax; 
        redcamara.numeromin= redcamara.numeromin; 
        redcamara.colonia= redcamara.colonia;
        redcamara.ciudad= redcamara.ciudad; 
        redcamara.estado= redcamara.estado; 
        redcamara.cp= redcamara.cp; 
        redcamara.participantes= redcamara.participantes;
        redcamara.estatus = redcamara.estatus;
        redcamara.notificaiones = "true";
        redcamara.save(function(err){
            if(err){res.send("Error");return;}
            res.send("redcamara con registro de notificaciones")
        })
    })
})
router.route("/token/:id")
    .get(function(req, res){
    Token.find({redcamaras_id: req.params.id}, function(err, tokens){
    if(err){res.send("error");return;}  
        //console.log(tokens);
    res.send({tokens: tokens})    
    });
    
})

router.route("/tokencheck/:id")
    .get(function(req, res){
    Token.findOne({_id:req.params.id, user_id:{$nin: [res.locals.user._id]}}, function(err, token){
    if(err){res.send("0");return;}  
        //console.log(token);
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

router.get("/vaciartokensalv", function(req,res){
  Token.findOneAndRemove({_id: "5a3adc83dce3755db69ec07d"}, function(err){
            if(!err){
            //console.log("Token Eliminado")
             res.send("Eliminado el token")}
            else{
                res.send("Error en alguna mamada")
            }
                              
        })
});

router.route("/usuario")
    .get(function(req, res){
    res.send(res.locals.user)
})


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;