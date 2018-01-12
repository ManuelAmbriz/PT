var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://root:root@ds135537.mlab.com:35537/pt");

var notificacionessensores_schema = new Schema({
    titulo: String,
    subtitulo: String,
    mensaje: String,
    fecha: String,
    sensor_id: {type: Schema.Types.ObjectId, ref: "Sensor"} ,
    raspberry_id: {type: Schema.Types.ObjectId, ref: "Raspberry"},
    user_id: {type: Schema.Types.ObjectId, ref: "User"}   
});


var Notificacionessensores = mongoose.model("Notificacionessensores", notificacionessensores_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Notificacionessensores= Notificacionessensores;  // exportar funciones metodos vaiables 