const fs = require('fs')
const fetch = require('node-fetch');
const parse = require('csv-parse')
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTWB15wJZWtL_imMr_kHX7DkJal2_G6OLSawSnLi0cKnMBssCmwQhN_ClEL-eC1AWLusPnY86dqX3l9/pub?gid=0&single=true&output=csv"

fetch(sheetURL)
    .then(res => res.text())
    .then(body => {
        parse(body, {columns: true}, function (err, data) {
            console.log(data)
            fs.writeFileSync('./_data/projects.json', JSON.stringify(data))
        })
    });