var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.connect("mongodb://root:root@ds135537.mlab.com:35537/pt");

var raspberry_schema = new Schema({
    ip: String,
    idRaspberry: String,
    notificacion: String, // Variable para saber si se envia o no la notificacion 
    user_id: {type: Schema.Types.ObjectId, ref: "User"}   
    
});


var Raspberry = mongoose.model("Raspberry", raspberry_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.Raspberry= Raspberry;  // exportar funciones metodos vaiables 