var Camara = require("../models/camaras").Camaras
var owner_check = require("./camaras_permisos")

module.exports = function(req,res, next){
    Camara.findById(req.params.id)
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, camaras){ 
            if(camaras != null && owner_check(camaras, req, res)){
                //console.log("Encontre la imagen " + redcamaras.calle + " del creador " + redcamaras.user_id.correo)
                res.locals.camaras = camaras;
                next();
            } else {
                res.redirect("/app");
                //se puede hacer un render a un 404 
            }

        })
}