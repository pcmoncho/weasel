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

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static('dist'));

const router = express.Router();
const rests = express.Router();

resources.forEach((resource)=> rests.route(resource.path).all((req, res)=> res.status(resource.status).jsonp(resource.response)));

//router.get('/', (req, res) => res.send("Aquí no hay nada"));
app.get('/', (req, res) => res.sendFile(`${__dirname} /dist/index.html`));

app.use(rests);
app.use(router);

app.listen(port, ()=>  console.log("Node server running on http://localhost:" + port));
