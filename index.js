/*jslint node:true, es5:true */
'use strict';

let resources = require('./resources/current-process');
let options = require('./resources/options');

const minimist = require('minimist');
const port = Number(options.port);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const fs = require('fs');
const cors = require('cors');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());

const router = express.Router();
const rests = express.Router();

app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type', 'application/json');

    next();
});

app.use(cors());

resources.forEach((resource)=> {
    if(resource.response.hasOwnProperty('weaselDocPath')) convertPDFToByteArray(resource);
    rests.route(resource.path).all((req, res)=> res.status(resource.status).jsonp(resource.response));
});

function convertPDFToByteArray(resource){
    rests.route(resource.path).all((req, res)=>{
        console.log(resource.response.weaselDocPath);
        fs.readFile(resource.response.weaselDocPath, "utf8", (err, data)=> {
            res.status(resource.status).jsonp(data);
        });
    });
}

router.get('/', (req, res) => res.send("Aquí no hay nada"));

app.use(rests);
app.use(router);

app.listen(port, ()=>  console.log("Node server running on http://localhost:" + port));
