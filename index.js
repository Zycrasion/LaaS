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

function RandomRange(mi, ma)
{
    ma = ma -1;
    let diff = ma - mi;
    return Math.floor(mi + (Math.random() * diff));
}

function RandomElement(li)
{
    return li[RandomRange(0, li.length)]
}

async function getFact()
{
    let facts = await fs.readFile(path.join(process.cwd(), "llama_fax"), {encoding:"utf-8"});
    facts = facts.split("\n");

    let fact = RandomElement(facts);
    return fact;
}

async function getPicFilename()
{
    let index = await retrieveIndex();
    let filename = RandomElement(index);
    return filename;
}

app.get("/llama", async (req,res) => {
    res.redirect("https://raw.githubusercontent.com/Zycrasion/LaaS/main/llama/".concat(await getPicFilename()));
});

app.get("/llama_url", async (req,res) => {
    res.send("https://raw.githubusercontent.com/Zycrasion/LaaS/main/llama/".concat(await getPicFilename()))
})

app.get("/llama_fax", async (req,res) => {
    res.send(await getFact())
})

app.get("/", (req,res) => {
    res.sendFile(path.join(process.cwd(), "index.html"))
})

app.listen(5000, ()=>{console.log("READY")});

module.exports = app;