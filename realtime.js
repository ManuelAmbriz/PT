module.exports = function(server, sessionMiddleare){
    var redis = require("redis");
    var cliente = redis.createClient();
    
    var io = require("socket.io")(server);
    
    io.use(function(socket,next){
       // console.log("Hola");
        sessionMiddleare(socket.request, socket.request.res, next);
    });

    io.sockets.on("connection", function(socket){ 
        console.log(socket.request.session.user_id)
    })
}
