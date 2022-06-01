const userModel = require("../models/userModel");
const {validationResult} = require("express-validator")
const {nanoid} = require("nanoid")

const registerForm = (req, res) => {
    res.render("register", {mensajes: req.flash("mensajes")})
};

//Este controller guarda la info del form en la DB   -   Siempre que se trabaje con DB debe ser ASYNC y AWAIT
const registerUser = async (req, res) => { 

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
        return res.redirect("/auth/register")
    }
    
    const {userName, email, password} = req.body
    try {
        let user =  await userModel.findOne({email: email})   // Verifico si existe en la DB
        if (user)  throw new Error ("Usuario ya existe")

        user = new userModel ({userName, email, password, tokenConfirm: nanoid() })  //Si no existe pues entonces lo registro en la DB
        await user.save()

        //enviar correo electrónico con confirmacion de cuenta
        req.flash("mensajes", [{msg: "Revisa tu email y verifica tu cuenta"}])
        res.redirect("/auth/login")
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/auth/register") 
    }
};

const confirmarCuenta = async (req, res) => {
    const {token} = req.params

    try {
        const user = await userModel.findOne({ tokenConfirm: token })
        if (!user) throw new Error ("No existe este usuario")

        user.cuentaConfirmada = true
        user.tokenConfirm = null
        await user.save()

        req.flash("mensajes", [{msg: "Cuenta verificada, puedes iniciar sessión"}])
        res.redirect("/auth/login")

        return res.redirect("/auth/login")

    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/auth/login")
    }
};

const loginForm = (req, res) => {
    res.render("login", {mensajes: req.flash("mensajes")})
};

const loginUser = async (req, res) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
        return res.redirect("/auth/login")
    }

    const {email, password} = req.body
    try {
        const user = await userModel.findOne({email})
        if(!user) throw new Error ("Usuario no ha sido registrado")

        if(!user.cuentaConfirmada) throw new Error ("Falta confirmar cuenta")

        if (!await user.comparePassword(password)) throw new Error ("Contraseña incorrecta")

        //esto crea la sesion de usuario con passport
        req.login(user, function(err){
            if(err) throw new Error ("error al crear la sessión")
            return res.redirect("/")
        })

    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/auth/login")
    }
};

const cerrarSesion = (req, res) => {
    req.logout(() => {})
    return res.redirect("/auth/login")
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
    cerrarSesion
}