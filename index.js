const express = require("express");

const app = express();
const fs = require("fs/promises")
const path = require("path");

app.get("/llama", async (req,res) => {
    let index = await fs.readFile(path.join(process.cwd(), "llama/index"), {encoding:"utf-8"});
    index = index.split("\n");
    
    let filename = "llama/".concat(index[Math.floor(Math.random() * index.length)]);

    res.sendFile(path.join(process.cwd(),filename));
});

app.get("/", (req,res) => {
    res.redirect("/llama")
})

app.listen(5000, ()=>{console.log("READY")});

module.exports = app;