const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    genero: { type: String, required: true },
    descripcion: String,
    imagen: String,
});

module.exports = mongoose.model("Game", gameSchema);
