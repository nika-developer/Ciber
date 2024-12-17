const mongoose = require('mongoose');
//Modelo de base de datos para los usuarios
const userSchema = mongoose.Schema({
    username : {
        type : String,
        required: true
    },
    email : {
        type : String,
        require : true,
        unique: true 
    },
    password : {
        type: String,
        require : true
    }
});

module.exports = mongoose.model('User', userSchema);