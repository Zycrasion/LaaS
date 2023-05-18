const express = require("express");

const app = express();
const fs = require("fs/promises")
const path = require("path");
const port = 80;

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

async function getFacts()
{
    return (await fs.readFile(path.join(process.cwd(), "llama_fax"), {encoding:"utf-8"})).split("\n");
}

async function getFact()
{
    let facts = await getFacts();

    let fact = RandomElement(facts);
    return fact;
}

async function getPicFilename()
{
    let index = await retrieveIndex();
    let filename = RandomElement(index);
    return filename;
}

function makeURL(a)
{
    return "https://raw.githubusercontent.com/Zycrasion/LaaS/main/llama/".concat(a);
}

async function getRandomImageURL(req)
{
    return makeURL(await getPicFilename());
}

app.get("/smart_llama/*", async function(req, res)
{
    let split = req.url.split("/");
    split.shift();
    res.type("application/json");

    let response = {
        errors : [],
    };

    if (split.length > 1)
    {
        let index = await retrieveIndex();
        let facts = await getFacts();
        for (let i = 1; i < split.length; i++)
        {
            let command = split[i];
            switch(command)
            {
                case "image_count":
                    response["image_count"] = index.length;
                    break;
                
                case "image_by_id":
                    response["image_url"] = makeURL(index[Math.floor(Number(split[++i]))]);
                    break;
                
                case "fact_count":
                    response["fact_count"] = facts.length;
                    break;

                case "fact_by_id":
                    response["fact"] = facts[Math.floor(Number(split[++i]))];
                    break;

                default:
                    response["errors"].push(command);
                    break;
            }
        }
    }
    
    res.send(JSON.stringify(response))
})

app.get("/llama_fact_and_image", async (req,res) => {
    const buffer = await require("./image_handler")(`${req.protocol}://${req.hostname}:${port}`);
    res.contentType('png');
    res.write(buffer);
    res.end();
})

app.get("/llama", async (req,res) => {
    if (req.hostname == "localhost")
    {
        res.write(await fs.readFile(process.cwd() + "/llama/" + await getPicFilename()))
        res.end();
        return;
    }
    res.redirect(await getRandomImageURL());
});

app.get("/llama_url", async (req,res) => {
    res.send(await getRandomImageURL())
})

app.get("/llama_fax", async (req,res) => {
    res.send(await getFact())
})

app.get("/", (req,res) => {
    res.sendFile(path.join(process.cwd(), "index.html"))
})

app.listen(port, ()=>{console.log("READY")});

module.exports = app;