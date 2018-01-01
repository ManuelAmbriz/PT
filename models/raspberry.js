var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://locahost/PT");

var raspberry_schema = new Schema({
    ip: String,
    user_id: {type: Schema.Types.ObjectId, ref: "User"}   
});


var Raspberry = mongoose.model("Raspberry", raspberry_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Raspberry= Raspberry;  // exportar funciones metodos vaiables 