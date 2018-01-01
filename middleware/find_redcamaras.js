var RedCamara = require("../models/redcamaras").RedCamaras
var owner_check = require("./redcamaras_permisos")

module.exports = function(req,res, next){
    RedCamara.findById(req.params.id)
        .populate("user_id")// join user where user_id = user.usr_id
        .exec(function(err, redcamaras){ 
            if(redcamaras != null && owner_check(redcamaras, req, res)){
                //console.log("Encontre la imagen " + redcamaras.calle + " del creador " + redcamaras.user_id.correo)
                res.locals.redcamaras = redcamaras;
                next();
            } else {
                res.redirect("/app");
                //se puede hacer un render a un 404 
            }

        })
}