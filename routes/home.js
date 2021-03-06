const express = require("express")
const { leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redireccionamiento } = require("../controllers/homeController")
const { formPerfil, editarFotoPerfil } = require("../controllers/perfilController")
const validarURL = require("../middlewares/urlValida")
const verificarUser = require("../middlewares/verificarUser")
const router = express.Router() 

router.get("/",verificarUser, leerUrls)
router.post("/", verificarUser, validarURL, agregarUrl)
router.get("/eliminar/:id", verificarUser, eliminarUrl)
router.get("/editar/:id", verificarUser, editarUrlForm)
router.post("/editar/:id", verificarUser, validarURL, editarUrl)
router.get("/perfil", verificarUser, formPerfil)
router.post("/perfil", verificarUser, editarFotoPerfil)


router.get("/:shortUrl", redireccionamiento)


module.exports = router