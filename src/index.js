const express = require ('express');
const mongoose = require ('mongoose');
const userRoutes = require('./routes/user.js');
const path = require ('path');
const { create } = require ('express-handlebars');

const app = express();
const port = process.env.PORT; 

require('dotenv').config();
//Middleware


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Para analizar cuerpos en JSON
app.use('/', userRoutes)
app.set('views', path.join(__dirname, '/views'));


const hbs = create({
    layoutsDir: path.join(app.get("views"), "layouts"),
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
        eq: (a, b) => a === b,
        concat: (...args) => {
            args.pop(); // El último argumento es el objeto de opciones de Handlebars
            return args.join('');
        }
    }
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");



app.listen(port, () => console.log('Server corriendo en el puerto',port ));

//Conectar DB
mongoose.connect(process.env.MONGO_URI).then(()=> console.log("Base de datos conectada")).catch((error) => console.error(error));