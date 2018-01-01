var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://locahost/PT");

var sensor_schema = new Schema({
    ip: String,
    _idsensor: String, 
    notificacion: String, // Variable para saber si se envia o no la notificacion 
    mensaje: String,
    raspberry_id: {type: Schema.Types.ObjectId, ref: "Raspberry"}   
});


var Sensor = mongoose.model("Sensor", sensor_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Sensor= Sensor;  // exportar funciones metodos vaiables 