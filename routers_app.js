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
router.get("/", function(req,res){
    res.render("app/home", {user: User})
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
    console.log(req.params.id)
    SolicitudUnirse.find({estatus:"Aprobado", redcamaras_id: req.params.id})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
        if(err){res.redirect("/app");return}
        res.render("app/redescamaras/user", {solicitudunirse:solicitudunirse})
        
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
           console.log("Aqui se puede modificar ")
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
                        console.log("Problema al aprobar la red ")
                        res.render("app/redescamaras/"+req.params.id)
                    }
                    
                })                
             });                     
            }, function(err){
            console.log(String(err));
            res.send("Error al aprobar la Red Intentelo mas tarde" + err);
        });   


    
})
    .delete(function(req,res){
        Camaras.find({redcamaras_id: req.params.id}).remove(function(err){
            if(!err){
                Notificaciones.find({redcamaras_id: req.params.id}).remove(function(err){
                    if(!err){
                        SolicitudUnirse.find({redcamaras_id: req.params.id}).remove(function(err){
                            if(!err){
                                    RedCamaras.findOneAndRemove({_id: req.params.id}, function(err){
                                    if(!err){
                                     res.redirect("/app/redescamaras/")}
                                    else{
                                        res.redirect("/app/redescamaras/show/"+req.params.id);
                                    }

                                })
                            }
                        })
                    }
                })
            }
        })
        
    });

router.route("/redescamaras")
    .get(function(req, res){
    RedCamaras.find({})
    .populate("user_id")                
    .exec(function(err, redcamaras){
    if(err){res.redirect("/app");return;}    
    res.render("app/redescamaras/index", {redcamaras:redcamaras})    
    });
    
})
    .post(function(req,res){
    console.log(res.locals.user._id);
  var redcamaras = new RedCamaras ({ calle: req.body.calle, numeromax: req.body.numeromax, numeromin: req.body.numeromin, 
                                      colonia: req.body.colonia, ciudad: req.body.ciudad, estado: req.body.estado, cp: req.body.cp, participantes: req.body.participantes, user_id: res.locals.user._id, estatus:req.body.estatus
        
    });
        redcamaras.save().then(function(us){
       res.redirect("/app/redescamaras/"); 
    }, function(err){
        console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
    
    
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/solicitud/new", function(req,res){
    res.render("app/solicitud/AltaRed")
    
});
router.all("/solicitud/:id*", Solicitud_finder)

router.get("/solicitud/:id/edit", function(req,res){

    res.render("app/solicitud/edit")   

});

router.route("/solicitud/:id")
    .get(function(req, res){       
        res.render("app/solicitud/show")   

})
    .put(function(req,res){
        console.log("Aqui entro para modificar");
        //res.send(redcamaras) res.locals = {redcamaras:redcamaras}
        res.locals.user.nombre= req.body.nombre; 
        res.locals.user.apellidopaterno= req.body.apellidopaterno; 
        res.locals.user.apellidomaterno= req.body.apellidomaterno; 
        res.locals.user.correo= req.body.email; 
        res.locals.user.contraseña= req.body.contraseña; 
        res.locals.user.save().then(function(us){
            res.render("app/solicitud/show")  
                    }, function(err){
                        res.render("app/solicitud/"+req.params.id+"/edit")  
                     }); 
    
})
    .delete(function(req,res){
         Camaras.find({user_id: req.params.id}).remove(function(err){
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

router.route("/solicitud")
    .get(function(req, res){
    RedCamaras.find({estatus:"Pendiente"})
    .populate("user_id")                
    .exec(function(err, redcamaras){
    if(err){res.redirect("/app");return;}    
    res.render("app/solicitud/index", {redcamaras:redcamaras})    
    });
    
})
    .post(function(req,res){
    console.log(res.locals.user._id);
  var redcamaras = new RedCamaras ({ calle: req.body.calle, numeromax: req.body.numeromax, numeromin: req.body.numeromin, 
                                      colonia: req.body.colonia, ciudad: req.body.ciudad, estado: req.body.estado, cp: req.body.cp, participantes: req.body.participantes, user_id: res.locals.user._id, estatus:req.body.estatus
        
    });
        redcamaras.save().then(function(us){
       res.redirect("/app/redescamaras/"); 
    }, function(err){
        console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
    
    
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/user/new", function(req,res){
    res.render("app/user/AltaRed")
    
});

//router.all("/redescamaras/:id*", Users_finder)

router.get("/user/:id/edit", function(req,res){
    User.findById({_id: req.params.id}, function(err, usuario){
        if(!err)}{
            res.render("app/user/edit", usuario: usuario) 
        }
    })
      

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
    User.findOneAndRemove({_id: req.params.id}, function(err){
            if(!err){
             res.redirect("/app/user/")}
            else{
                res.redirect("/app/user/show/"+req.params.id);
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
        console.log(String(err));
        res.send("No Chingon :( " + err);
    });   
    
    
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get("/redescamaras/vercam", function(req,res){
    //res.render("userapp/redescamaras/AltaRed")
    console.log(req.params.id)
    SolicitudUnirse.find({estatus: "Aprobado", user_id:res.locals.user._id})
        .populate("redcamaras_id")
        .populate("user_id")
        .exec(function(err, solicitudunirse){
        if(err){res.redirect("/app");return}
        res.render("userapp/redescamaras/verred", {solicitudunirse:solicitudunirse})
        
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

router.route("/redcamaradeletependejodiego")
.get(function(req, res){
   RedCamaras.findOneAndRemove({_id: "5a4e9fdc6083b50004fc25d0"}, function(err){
       if(!err){res.send("Diego tan wey")}
   })
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;