const express = require ('express');
const mongoose = require ('mongoose');
const userRoutes = require('./routes/user.js');
const path = require ('path');
const { create } = require ('express-handlebars');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000; 

//Middleware


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Para analizar cuerpos en JSON
app.use('/', userRoutes)
app.set('views', path.join(__dirname, '/views'));

const hbs = create({
    layoutsDir: path.join(app.get("views"), "layouts"),
    defaultLayout: "main",
    extname: ".hbs"
})

app.set("view engine", ".hbs");

app.engine(".hbs",hbs.engine);


app.listen(port, () => console.log('Server corriendo en el puerto',port ));

//Conectar DB
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("Base de datos conectada")).catch((error) => console.error(error));