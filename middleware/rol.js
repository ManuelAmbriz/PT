var User = require("../models/user").User; // agarra todo lo que se pone en el exports 
module.exports = function(req, res, next){
    if(!req.session.user_id){
        res.redirect("/")
    }
    else {
        User.findById(req.session.user_id,function(err,user){
            if(err){
                console.log(err);
                res.redirect("/");
            }
            else {
                res.locals = { user: user};
                next();
            }
        });
        
    } 
}