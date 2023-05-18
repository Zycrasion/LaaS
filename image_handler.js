const canvas = require("canvas");
const wrap = require("word-wrap");
const fetch = require("node-fetch");

function Overlay(curr_url)
{
    return new Promise(resolve => {
        const canv = canvas.createCanvas(2000, 2000);
        const width = canv.width;
        const height = canv.height;
    
        const context = canv.getContext("2d");
    
        context.fillStyle = "#000000";
        context.fillRect(0,0, width, height);
    
        canvas.loadImage(curr_url.concat("/llama")).then(async data => {
            let iW = width;
            let iH = (data.height / data.width) * (height);
            context.drawImage(data, width/2 - (iW/2), height/2 - (iH/2), iW, iH);
    
            context.font = 'bold 45% Menlo'
            context.textAlign = 'center'
            context.textBaseline = 'top'
            context.fillStyle = '#3574d4'
            
            var response = await fetch(curr_url.concat("/llama_fax"));
            response = await response.text();
            console.log(response);
            var text = wrap(response, {width: 50});
        
            const textHeight = context.measureText(text).emHeightDescent
            context.fillRect(40, 80, width-80, textHeight+40)
            context.fillStyle = '#fff'
            context.fillText(text, width/2, 100)
        
            context.fillStyle = '#fff'
            context.font = 'bold 50pt Menlo'
            context.fillText('Random Llama facts (llama-as-a-service.vercel.app)', width/2, height-100)
        
            const buffer = canv.toBuffer('image/png')
            resolve(buffer);
        });
    })
}

module.exports = Overlay;