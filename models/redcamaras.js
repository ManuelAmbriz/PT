//Tabla de Usuarios.
var mongoose = require("mongoose");
var Schema = mongoose.Schema; // COntructor para los Schemas
mongoose.connect("mongodb://root:root@ds135537.mlab.com:35537/pt");  // coneccion a base de datos 


var redcamaras_schema = new Schema({
    calle: String, 
    numeromax: Number,
    numeromin: Number, 
    colonia: String,
    ciudad: String,
    estado: String, 
    cp: String,
    participantes: Number,
    estatus: String, 
    user_id: {type: Schema.Types.ObjectId, ref: "User"},
    notificaiones: String,
    //redcamaras : String,
});

/*user_schema.virtual("password_confirmation").get(function(){
    return this.p_c;
}).set(function(contraseña){
    this.p_c = contraseña;
});

user_schema.virtual("full_name").get(function(){
    return this.nombre + this.apellidopaterno + this.apellidomaterno;
}).set(function(full_name){
    var words = full_name.split(" ");
    this.nombre = words[0];
    this.apellidopaterno = words[1];
    this.apellidomaterno = words[2];
});*/

var RedCamaras = mongoose.model("RedCamaras", redcamaras_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.RedCamaras= RedCamaras;  // exportar funciones metodos vaiables 
