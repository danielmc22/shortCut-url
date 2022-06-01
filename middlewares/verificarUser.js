module.exports = (req, res, next) => {
    if(req.isAuthenticated()) {   //verifica si existe una session iniciada
        return next()
    }
    res.redirect("/auth/login")   //si no existe entonces redirige a la pag. de login
}