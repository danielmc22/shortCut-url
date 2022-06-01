const express = require("express");
const {body} = require("express-validator")

const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser, cerrarSesion } = require("../controllers/authController");
const router = express.Router() 

router.get("/register", registerForm);
router.post("/register", [
    body("userName", "ingrese un nombre válido").trim().notEmpty().escape(),
    body("email", "ingrese email válido" ).trim().isEmail().normalizeEmail(),
    body("password", "Contraseña minimo 6 caracteres")
    .trim()
    .isLength({min: 6})
    .escape()
    .custom((value, {req}) => {
        if (value !== req.body.repassword) {
            throw new Error ("no coinciden las contraseñas")
        } else {
            return value
        }
    })

], registerUser);

router.get("/confirmarCuenta/:token", confirmarCuenta)
router.get("/login", loginForm);
router.post("/login", [
    body("email", "ingrese email válido" ).trim().isEmail().normalizeEmail(),
    body("password", "Contraseña minimo 6 caracteres")
    .trim()
    .isLength({min: 6})
    .escape()
], loginUser);

router.get("/logout1", cerrarSesion) 


module.exports = router