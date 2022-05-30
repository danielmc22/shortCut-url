const { URL } = require("url");

const validarURL = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);
        if (urlFrontend.origin !== "null") {
            return next();
        } else {
            throw new Error("no válida 😲");
        }
    } catch (error) {
        console.log(error);
        console.log("ingrese una url valida porfa")
        return res.send("URL No válida pap'a");
    }
};

module.exports = validarURL;