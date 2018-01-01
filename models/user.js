//Tabla de Usuarios.
var mongoose = require("mongoose");
var Schema = mongoose.Schema; // COntructor para los Schemas
mongoose.connect("mongodb://localhost/PT");  // coneccion a base de datos 


var user_schema = new Schema({
    nombre: String, 
    apellidopaterno: String,
    apellidomaterno: String,
    domiciolio: String, 
    correo: String,
    contraseña: String,
    rol: String,
               
    //redcamaras: String,
    
});

user_schema.virtual("password_confirmation").get(function(){
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
});

var User = mongoose.model("User", user_schema); // model es el contructor // nombre de la collecion y luego el esquema 

module.exports.User= User;  // exportar funciones metodos vaiables 
