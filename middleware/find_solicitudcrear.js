var SolicitudCrear = require("../models/solicitudunirse").SolicitudCrear

module.exports = function(req,res, next){
    SolicitudCrear.findById(req.params.id)
        .populate("user_id")// join user where user_id = user.usr_id
        .populate("redcamaras_id")
        .exec(function(err, solicitudcrear){
        if(solicitudcrear != null){
            console.log("Encontre la solictud de " + solicitudcrear.nombre)
            res.locals.solicitudcrear = solicitudcrear;
            next();
        } else {
            res.redirect("/app");
            //se puede hacer un render a un 404 
        }
        
    })
}
