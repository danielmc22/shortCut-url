const Url = require("../models/url")
const {nanoid}  = require("nanoid")
const { findByIdAndDelete } = require("../models/url")

const leerUrls = async (req, res) => {
    try {
        const urlx = await Url.find().lean()
        res.render("home",{ url: urlx })
          
    } catch (error) {
        console.log(error)
        res.send("algo falló controller leer url")
    }
}

const agregarUrl = async (req, res) => {
    const {origin} = req.body

    try {
        const url = new Url({ origin:origin, shortUrl: nanoid(8) })
        await url.save()
        res.redirect("/")
    } catch (error) {
        console.log(error)
        res.send("error algo falló")
    }
}

const eliminarUrl = async (req, res ) => {
    const {id} = req.params
    try {
        await Url.findByIdAndDelete(id)
        res.redirect("/")
        
    } catch (error) {
        console.log(error)
        res.send("error en eliminarUrl controller")
    }
}

const editarUrlForm = async (req, res) => {
    const {id} = req.params
    try {
        const urlx = await Url.findById(id).lean()
        res.render("home", {urlx})
    } catch (error) {
        console.log(error)
        res.send("Algo falló editarUrl controller")
    }
}

const editarUrl = async (req, res) => {
    const {id} = req.params
    const {origin} = req.body
    try {
        await Url.findByIdAndUpdate(id, {origin: origin})
        res.redirect("/")
    } catch (error) {
        console.log(error)
        res.send("Algo falló editarUrl controller")
    }
}

const redireccionamiento = async (req, res) => {
    const {shortUrl} = req.params
    try {
        const urlDB = await Url.findOne({ shortUrl: shortUrl })
        res.redirect(urlDB.origin)
    } catch (error) {
        
    }
}

module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento
}