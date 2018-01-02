//Tabla de Usuarios.
var mongoose = require("mongoose");
var Schema = mongoose.Schema; // COntructor para los Schemas
mongoose.connect("mongodb://root:root@ds135537.mlab.com:35537/pt");  // coneccion a base de datos 


var solicitudunirse_schema = new Schema({
    estatus: String, 
    mensaje: String,
    user_id: {type: Schema.Types.ObjectId, ref: "User"},
    redcamaras_id: {type: Schema.Types.ObjectId, ref: "RedCamaras"}
});

var SolicitudUnirse = mongoose.model("SolicitUdunirse", solicitudunirse_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.SolicitudUnirse = SolicitudUnirse




;  // exportar funciones metodos vaiables 
