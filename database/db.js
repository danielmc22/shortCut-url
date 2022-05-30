const mongoose = require("mongoose")

mongoose
    .connect(process.env.URI)
    .then(() => console.log("db connected 🐽 "))
    .catch(e => console.log("falló la conexión " + e))

// CONFIG BÁSICA PARA CONECTARNOS A LA BASE DE DATOS