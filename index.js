const express = require("express");
const { create } = require("express-handlebars");
require("dotenv").config();   //para que se lean las variables de entorno
require("./database/db")     // para que se lea la conexión a la db
const bodyParser = require('body-parser')

const app = express();

const hbs = create({
    extname: ".hbs",
    partialsDir : ["views/components"]
})

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


app.use(express.urlencoded({extended:true}))  // habilitaos los formularios
app.use("/", require("./routes/home"))
app.use("/auth", require("./routes/auth"))


const PORT = process.env.PORT || 5000

app.listen(PORT, () => 
    console.log("Servidor funcionando 👽 🐽 " + PORT )
);





