var User = require("../models/user").User; // agarra todo lo que se pone en el exports 
module.exports = function(req, res, next){
    if(!req.session.user_id){
        res.send("Debe Iniciar Sesión")
    }
    else {
        User.findById(req.session.user_id,function(err,user){
            if(err){
                console.log(err);
                res.send("Debe Iniciar Sesión")
            }
            else {
                //console.log("Aqui entro en el Middleware Movil")
                //console.log(user)
                res.locals = { user: user};
                next();
            }
        });
        
    } 
}