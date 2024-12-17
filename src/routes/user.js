const express = require("express");
const userSchema = require("../models/user.js");
const stationSchema = require("../models/station.js");
const router = express.Router();

//Crear usuario
router.post("/api/users", (req, res) => {
    const user = userSchema(req.body);
    user.save()
        .then((data) => res.render("index"))
        .catch((error) => res.json({ message: error }));
    console.log(req.body);
});

//Crear estaciones
router.post("/api/stations", (req, res) => {
    const user = stationSchema(req.body);
    user.save()
        .then((data) => res.render("index"))
        .catch((error) => res.json({ message: error }));
    console.log(req.body);
});

//Obtener todos los usuarios
router.get("/api/users", (req, res) => {
    userSchema
        .find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
    console.log(req.body);
});

//Obtener un usuario por id
router.get("/api/users/:id", (req, res) => {
    const { id } = req.params;
    userSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Actualizar un usuario por id
router.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { username, email, rol, password } = req.body;
    userSchema
        .updateOne({ _id: id }, { $set: { username, email, rol, password } })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Eliminar un usuario por id
router.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    userSchema
        .deleteOne({ _id: id })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Obtener una estacion por id
router.get("/api/stations/:id", (req, res) => {
    const { id } = req.params;
    stationSchema
        .findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/register", (req, res) => {
    res.render("register");
});
// Render del register
router.get("/dashboard", (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.redirect("/");
    }

    stationSchema
        .find()
        .then((data) => {
            // Limpiar los datos antes de enviarlos para evitar errores
            const cleanData = data.map((item) => ({
                category: item.category,
                number: item.number,
            }));

            res.render("dashboard", { data: cleanData, username: username });
        })
        .catch((error) => res.json({ message: error }));
});

// POST del login
router.post("/login", async (req, res) => {
    const username = req.body;
    console.log(username);
    let userFound;
    try {
        userFound = await userSchema.findOne(username);
    } catch (error) {
        res.json({ message: error.message });
    }
    if (userFound) {
        return res.json({
            success: true,
            message: "Inicio de sesión exitoso",
            userFound,
        });
    } else {
        return res.json({
            success: false,
            message: "Usuario no encontrado",
        });
    }
});

module.exports = router;
