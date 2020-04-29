var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://root:root@ds135537.mlab.com:35537/pt");  // coneccion a base de datos 

var clabe_banks_schema = new Schema({
    key: String,
    name: String,
    shortname : String
});


var Clabe_banks = mongoose.model("Clabe_banks", clabe_banks_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Clabe_banks= Clabe_banks;  // exportar funciones metodos vaiables 