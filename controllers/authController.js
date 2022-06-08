const userModel = require("../models/userModel");
const {validationResult} = require("express-validator")
const {nanoid} = require("nanoid")
const nodemailer = require("nodemailer")
require("dotenv").config()

const registerForm = (req, res) => {
    res.render("register")
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
        const transport = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.userEmail,
              pass: process.env.passEmail
            }
          });

          await transport.sendMail({
            from: '"🙌" twitch@ignaciogutierrez.cl', // sender address
            to: user.email, // list of receivers
            subject: "Verifica tu cuenta de correo", // Subject line
            html: `<a href="http://localhost:5000/auth/confirmarCuenta/${user.tokenConfirm}"> Verifica tu cuenta aquí </a>`, // html body
        });

        req.flash("mensajes", [{msg: "Revisa tu email y verifica tu cuenta"}])
        return res.redirect("/auth/login")

    } catch (error) {
        req.flash("mensajes", [{msg: error.message}])
        return res.redirect("/auth/register") 
    }
};

const loginForm = (req, res) => {
    res.render("login")
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

const confirmarCuenta = async (req, res) => {
    const {token} = req.params

    try {
        const user = await userModel.findOne({ tokenConfirm: token })
        if (!user) throw new Error ("No existe este usuario")

        user.cuentaConfirmada = true
        user.tokenConfirm = null
        await user.save()

        req.flash("mensajes", [{msg: "Cuenta verificada, puedes iniciar sessión"}])

        return res.redirect("/auth/login")

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