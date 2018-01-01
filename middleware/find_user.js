var User = require("../models/user").User

module.exports = function(req,res, next){
    User.findById(req.params.id , function(err, user){
        if(user != null){
            console.log("Encontre la solictud de " + user.nombre)
            res.locals.user = user;
            next();
        } else {
            res.redirect("/app");
            //se puede hacer un render a un 404 
        }
        
    })
}
