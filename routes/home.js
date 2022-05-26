const express = require("express")
const router = express.Router() 

router.get("/", (req, res) => {
    const url = [
        {url : "www.dani-div.co1", short : "uiwcwe1"},
        {url : "www.dani-div.co2", short : "uiwcwe2"},
        {url : "www.dani-div.co3", short : "uiwcwe3"},
    ];
    res.render('home',{ url })
})



module.exports = router