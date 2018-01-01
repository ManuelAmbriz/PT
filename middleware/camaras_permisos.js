var Camara = require("../models/camaras").Camaras
var SolicitudUnirse = require("../models/solicitudunirse").SolicitudUnirse;

module.exports = function(camaras, req,res){
    SolicitudUnirse.find({user_id: res.locals.user._id , estatus:"Aprabado"})
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, solicitudunirse){ 
            if(solicitudunirse != null){
               if (solicitudunirse.redcamaras._id.toString() == camaras.redcamaras_id._id.toString() || res.locals.user.rol == "Administrador"){
                   return true;
               }
                else {return false }
            } else {
                return false; 
            }

        })
}