const mongoose = require("mongoose");

const reserveSchema = new mongoose.Schema({
    username: { type: String, required: true },
    category: { type: String, required: true },
    number: { type: Number, required: true },
    game: { type: String, required: true },
    fecha: { type: String, required: true },  // 📅 Guardar la fecha como string (YYYY-MM-DD)
    hora: { type: String, required: true },   // ⏰ Guardar la hora como string (HH:MM)
    createdAt: { type: Date, default: Date.now },
});

const Reserve = mongoose.model("Reserve", reserveSchema);
module.exports = Reserve;