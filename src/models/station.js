const mongoose = require('mongoose');
//Modelo de base de datos para las estaciones
const stationSchema = mongoose.Schema({
    category : {
        type : String,
        required: true
    },
    number : {
        type : Number,
        require : true,
        unique: true 
    }
});

module.exports = mongoose.model('Station', stationSchema);