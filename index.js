const express = require("express");
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const { create } = require("express-handlebars");
const csrf = require("csurf")
require("dotenv").config();   //para que se lean las variables de entorno
require("./database/db")     // para que se lea la conexión a la db
const bodyParser = require('body-parser');
const userModel = require("./models/userModel");

const app = express();

app.use(session({
    secret: "keyboard dog",
    resave: false,
    saveUninitialized: false,
    name: "secret-name-holi"
}))

app.use(flash())
//--------------------------------------------------------------------------- sesion con passport configuracion
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done ) => done(null, {id: user._id, userName: user.userName}) ) //con esto se crea la session
passport.deserializeUser(async(user, done) => {
    const userDB = await userModel.findById(user.id)
    return done(null, {id: userDB._id, userName: userDB.userName})
})
//--------------------------------------------------------------------------

const hbs = create({
    extname: ".hbs",
    partialsDir : ["views/components"]
})

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(csrf())

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    res.locals.mensajes = req.flash("mensajes")
    next()
})
// parse application/json
app.use(bodyParser.json())


app.use(express.urlencoded({extended:true}))  // habilitaos los formularios
 
app.use("/", require("./routes/home"))
app.use("/auth", require("./routes/auth"))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => 
    console.log("Servidor funcionando 👽 🐽 " + PORT )
);





