var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb+srv://mambriz:huevosMongo17@cluster0-9mnx9.mongodb.net/test?retryWrites=true&w=majority");

var clabe_banks_schema = new Schema({
    clabe: String,
    bank: String,
    
});


var Clabe_banks = mongoose.model("Clabe_banks", clabe_banks_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Clabe_banks= Clabe_banks;  // exportar funciones metodos vaiables 