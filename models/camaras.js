var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://root:root@ds135537.mlab.com:35537/pt");

var camaras_schema = new Schema({
    ip: String,
    numeroex: String,
    user_id: {type: Schema.Types.ObjectId, ref: "User"},
    redcamaras_id:{type: Schema.Types.ObjectId, ref: "RedCamaras"} 
    
});


var Camaras = mongoose.model("Camaras", camaras_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Camaras= Camaras;  // exportar funciones metodos vaiables  