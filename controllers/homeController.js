const Url = require("../models/url")
const {nanoid}  = require("nanoid")
const { findByIdAndDelete, findById } = require("../models/url")

const leerUrls = async (req, res) => {
    try {
        const urlx = await Url.find({user: req.user.id}).lean()
        res.render("home",{ url: urlx })
          
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/")
    }
}

const agregarUrl = async (req, res) => {
    const {origin} = req.body

    try {
        const url = new Url({ origin:origin, shortUrl: nanoid(8), user: req.user.id })
        await url.save()
        res.redirect("/")
        req.flash("mensajes", [{msg: "URL agregada"}])
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/")
    }
}

const eliminarUrl = async (req, res ) => {
    const {id} = req.params
    try {
        const url = await Url.findById(id)
        if(!url.user.equals(req.user.id)) {
            throw new Error()
        }
        await Url.remove()
        req.flash("mensajes", [{msg: "URL Eliminada"}])
        return res.redirect("/")
        
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/")
    }
}

const editarUrlForm = async (req, res) => {
    const {id} = req.params
    try {
        const urlx = await Url.findById(id).lean()
        if(!urlx.user.equals(req.user.id)) {
            throw new Error()
        }
        return res.render("home", {urlx})
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/")
    }
}

const editarUrl = async (req, res) => {
    const {id} = req.params
    const {origin} = req.body
    try {
        const urlf = await Url.findById(id)
        if(!urlf.user.equals(req.user.id)) {
            throw new Error("No es tu URL")
        }
        await urlf.updateOne({ origin })
        req.flash("mensajes", [{msg: "URL Editada"}])

        /* await Url.findByIdAndUpdate(id, {origin: origin}) */
        res.redirect("/")
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/")
    }
}

const redireccionamiento = async (req, res) => {
    const {shortUrl} = req.params
    try {
        const urlDB = await Url.findOne({ shortUrl: shortUrl })
        res.redirect(urlDB.origin)
    } catch (error) {
        req.flash("mensajes", [{msg: "no existe esta url configurada"}])
        return res.redirect("/")
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