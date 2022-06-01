console.log("estoy aqui")

document.addEventListener("click", (e) => {
    if (e.target.dataset.short){
        const url = `http://localhost:5000/${e.target.dataset.short}`

        navigator.clipboard
        .writeText(url)
        .then(() => {
            console.log("texto copiado")
        })
        .catch((err) => {
            console.log("algo salió mal", err)
        })
    }
})