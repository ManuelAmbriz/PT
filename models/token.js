
//Tabla de Usuarios.
var mongoose = require("mongoose");
var Schema = mongoose.Schema; // COntructor para los Schemas
mongoose.connect("mongodb://root:root@ds135537.mlab.com:35537/pt");  // coneccion a base de datos 


var token_schema = new Schema({
    token: String, 
    user_id: {type: Schema.Types.ObjectId, ref: "User"},
    redcamaras_id: String
});

var Token = mongoose.model("Token", token_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Token = Token




;  // exportar funciones metodos vaiables 
