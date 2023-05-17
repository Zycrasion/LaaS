const express = require("express");

const app = express();
const fs = require("fs/promises")
const path = require("path");

async function retrieveIndex()
{
    let contents = await fs.readFile(path.join(process.cwd(), "llama_picture_index"), {encoding:"utf-8"});
    contents = contents.split("\n").filter(v=>{
        return v != ""
    });
    return contents;
}

app.get("/llama", async (req,res) => {
    let index = await retrieveIndex();
    
    let filename = "llama/".concat(index[Math.floor(Math.random() * index.length)]);

    res.redirect("https://raw.githubusercontent.com/Zycrasion/LaaS/main/".concat(filename));
});

app.get("/llama_url", async (req,res) => {
    let index = await retrieveIndex();
    
    let filename = "llama/".concat(index[Math.floor(Math.random() * index.length)]);
    let pathToFile = "https://raw.githubusercontent.com/Zycrasion/LaaS/main/".concat(filename);

    res.send(pathToFile)
})

app.get("/llama_fax", async (req,res) => {
    let facts = await fs.readFile(path.join(process.cwd(), "llama_fax"), {encoding:"utf-8"});
    facts = facts.split("\n");

    let fact = facts[Math.floor(Math.random() * facts.length)];

    res.send(fact)
})

app.get("/", (req,res) => {
    res.sendFile(path.join(process.cwd(), "index.html"))
})

app.listen(5000, ()=>{console.log("READY")});

module.exports = app;