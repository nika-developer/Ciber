const express = require("express");
const userSchema = require("../models/user.js");
const stationSchema = require("../models/station.js");
const Game = require("../models/game.js");
const Reserve = require("../models/reserve.js");
const station = require("../models/station.js");
const user = require("../models/user.js");
const router = express.Router();

//Crear usuario
router.post("/api/users", async (req, res) => {
    try {
        const user = new userSchema(req.body);
        await user.save();
        res.render("login", { successMessage: "Usuario creado exitosamente" });
    } catch (error) {
        res.render("register", { errorMessage: "Error al crear usuario" });
    }
});

//Crear estaciones
router.post("/admin/station/create", async (req, res) => {
    try {
        const estacion = new stationSchema(req.body);
        await estacion.save();
        res.redirect("/admin-dashboard");
    } catch (error) {
        res.status(500).json({ message: "Error al crear estación", error });
    }
});

//Crear juegos
router.post("/admin/games/create", (req, res) => {
    try {
        const juegos = Game(req.body);
        juegos.save();
        console.log(req.body);

        res.redirect("/admin-dashboard");
    } catch (error) {
        res.status(500).json({ message: "Error al crear el juego", error });
    }
});
//Editar juegos
router.post("/admin/games/edit/:id", async (req, res) => {
    try {
        await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect("/admin-dashboard");
    } catch (error) {
        console.error("Error al editar juego:", error);
        res.status(500).json({ message: "Error al editar el juego", error });
    }
});

//Editar estaciones
router.post("/admin/station/edit/:id", async (req, res) => {
    try {
        await station.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.redirect("/admin-dashboard");
    } catch (error) {
        res.status(500).json({ message: "Error al editar estación", error });
    }
});

//Editar usuarios
router.post("/admin/user/edit/:id", async (req, res) => {
    try {
        await userSchema.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.redirect("/admin-dashboard");
    } catch (error) {
        res.status(500).json({ message: "Error al editar usuario", error });
    }
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

router.get("/edit/:id", async (req, res) => {
    try {
        const reserva = await Reserve.findById(req.params.id);
        res.render("/dashboard", { reserva });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar la reserva");
    }
});

router.post("/edit/:id", async (req, res) => {
    try {
        await Reserve.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar la reserva");
    }
});

//Eliminar Juego
router.post("/admin/delete/game/:id", async (req, res) => {
    try {
        await Game.findByIdAndDelete(req.params.id);
        res.redirect("/admin-dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la reserva");
    }
});

//Eliminar Estacion
router.post("/admin/delete/station/:id", async (req, res) => {
    try {
        await station.findByIdAndDelete(req.params.id);
        res.redirect("/admin-dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la estacion");
    }
});

//Eliminar Reserva
router.post("/admin/delete/reserve/:id", async (req, res) => {
    try {
        await Reserve.findByIdAndDelete(req.params.id);
        res.redirect("/admin-dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la reserva");
    }
});

//Eliminar Usuario
router.post("/admin/delete/user/:id", async (req, res) => {
    try {
        await user.findByIdAndDelete(req.params.id);
        res.redirect("/admin-dashboard");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar el usuario");
    }
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

router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/dashboard", async (req, res) => {
    // Agregamos 'async' para usar 'await'
    let username = req.query.username?.replace(/^"|"$/g, "");
    console.log(username);
    if (!username) {
        return res.redirect("/login");
    }

    try {
        const estaciones = await stationSchema.find(); // Consulta de estaciones
        const juegos = await Game.find().lean(); // Consulta de juegos

        // Limpiar los datos antes de enviarlos para evitar errores
        const cleanData = estaciones.map((item) => ({
            category: item.category,
            number: item.number,
        }));

        res.render("dashboard", {
            data: cleanData,
            juegos, // Enviamos los juegos al dashboard
            username,
        });
    } catch (error) {
        res.json({ message: error.message });
    }
});

module.exports = router;

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

// Crear una reserva

router.post("/create", async (req, res) => {
    try {
        const { username, estacion, category, game, fecha, hora } = req.body;

        if (!fecha || !hora) {
            return res
                .status(400)
                .json({ error: "Debes seleccionar una fecha y hora." });
        }

        //  Verificar si la estación ya está reservada por cualquier usuario en la misma fecha y hora
        const reservaExistente = await Reserve.findOne({
            number: estacion,
            fecha,
        });

        if (reservaExistente) {
            return res.status(400).json({
                error: "Esta estación ya está reservada en esta fecha y hora.",
            });
        }

        //  Si no hay reservas duplicadas, crear la nueva
        const nuevaReserva = new Reserve({
            username,
            category,
            number: estacion,
            game,
            fecha,
            hora,
            createdAt: new Date(),
        });

        await nuevaReserva.save();
        res.json({
            success: true,
            redirectUrl: `/dashboard?username=${username}`,
        });
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Obtener reservas por usuario (usando username)
router.get("/reservations", async (req, res) => {
    try {
        let username = req.query.username?.replace(/^"|"$/g, "");

        if (!username) {
            return res.status(400).json({ message: "Falta el username" });
        }

        console.log("🔍 Buscando reservas para:", username); // 🛠 Verificación en consola

        const allReservations = await Reserve.find(); // Obtener TODAS las reservas
        console.log(
            "📜 Todas las reservas en la base de datos:",
            allReservations
        );

        const userReservations = await Reserve.find({ username });
        const stations = await station.find(); // O como las tengas cargadas


        console.log(
            "✅ Reservas encontradas para",
            username,
            ":",
            userReservations
        );

        res.json({userReservations, stations});
    } catch (error) {
        console.error("❌ Error al obtener reservas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Ruta del Dashboard de Administradores
router.get("/admin-dashboard", async (req, res) => {
    try {
        const juegos = await Game.find().lean();
        const estaciones = await stationSchema.find().lean();
        const usuarios = await userSchema.find().lean();
        const reservas = await Reserve.find()
            .populate("username")
            .populate("category")
            .lean();
        console.log(reservas);

        res.render("admin-Dashboard", {
            juegos,
            estaciones,
            usuarios,
            reservas,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al cargar el dashboard",
            error,
        });
    }
});

module.exports = router;

module.exports = router;
