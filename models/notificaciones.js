var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://root:root@ds135537.mlab.com:35537/pt");

var notificaciones_schema = new Schema({
    titulo: String,
    subtitulo: String,
    mensaje: String,
    fecha: String,
    user_id: {type: Schema.Types.ObjectId, ref: "User"},
    redcamaras_id:{type: Schema.Types.ObjectId, ref: "RedCamaras"}
    
});


var Notificaciones = mongoose.model("Notificaciones", notificaciones_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Notificaciones= Notificaciones;  // exportar funciones metodos vaiables 