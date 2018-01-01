var RedCamara = require("../models/redcamaras").RedCamaras

module.exports = function(redcamaras, req, res){
    
    if(req.method === "GET" && req.path.indexOf("edit")<0){
        return true;
    }
    
    if(redcamaras.user_id._id.toString() == res.locals.user._id || res.locals.user.rol == "Administrador"){
        return true;
    }
    return false;
}