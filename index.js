const request = require('request');
const fs = require('fs');
const readline = require('readline');

const apiURL = "https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/ddaa56be-ad57-4c87-bd90-265c5d249a9a/v3/tone?version=2017-09-21";
const apiKey = "Basic YXBpa2V5OldBRVpPZV9ERVdDU2xrbU91d1VlT1JocFhpNkY5WmluWjFQVGRpY09rSE5T"
const jsonFile = "Musical_Instruments_5.json"


let rawdata = fs.readFileSync(jsonFile);

let text = []
async function processLineByLine() {
  const fileStream = fs.createReadStream(jsonFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    let textdata = JSON.parse(line);
    text.push({'text':textdata['reviewText']});
  }
}


const analysis = []
processLineByLine().then(()=>{
    console.log(text);
    for (let index = 90; index < 100; index++) {
        const options = {
            'method': 'POST',
            'url': apiURL,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify(text[index])
            
            };
            request(options, function (error, response) { 
            if (error) console.log(error);
            analysis.push(response.body);
            });
    }
    
})

let runFile = ()=>{
    fs.writeFileSync('analisis.json', analysis) ;
}
setTimeout(runFile, 2000)

