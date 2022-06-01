const express = require("express")
const { leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionamiento } = require("../controllers/homeController")
const validarURL = require("../middlewares/urlValida")
const verificarUser = require("../middlewares/verificarUser")
const router = express.Router() 

router.get("/",verificarUser, leerUrls)
router.post("/", validarURL, agregarUrl)
router.get("/eliminar/:id", eliminarUrl)
router.get("/editar/:id", editarUrlForm)
router.post("/editar/:id", validarURL, editarUrl)
router.get("/:shortUrl", redireccionamiento)



module.exports = router