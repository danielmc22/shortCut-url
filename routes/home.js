const express = require("express")
const { leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl } = require("../controllers/homeController")
const validarURL = require("../middlewares/urlValida")
const router = express.Router() 

router.get("/", leerUrls)
router.post("/", validarURL, agregarUrl)
router.get("/eliminar/:id", eliminarUrl)
router.get("/editar/:id", editarUrlForm)
router.post("/editar/:id", validarURL, editarUrl)



module.exports = router