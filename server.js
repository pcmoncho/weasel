/*jslint node:true, es5:true */
'use strict';

const port = Number(process.env.PORT || 3002);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

let _process = require('./controllers/process');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname+'/dist'));

const router = express.Router();
const rests = express.Router();

app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type', 'application/json');

    next();
});

rests.route('/list/folders/:name').get(_process.listFolders);
rests.route('/list/rests').get(_process.listRests);
rests.route('/list/options').get(_process.listOptions);

rests.route('/import/folder/:name/:addRest').post(_process.importFolder);

rests.route('/add/folder/:name').post(_process.addFolder);
rests.route('/add/rest/:name').post(_process.addRest);
rests.route('/add/rest-folder/:name').post(_process.addRestToFolder);

rests.route('/delete/folder/:name').post(_process.deleteFolder);
rests.route('/delete/rest/:name').post(_process.deleteRest);

rests.route('/remove/rest/:name').post(_process.removeRest);

rests.route('/options').post(_process.saveOptions);
rests.route('/start/:name').get(_process.start);
rests.route('/kill').get(_process.kill);

router.get('/', (req, res) => res.sendFile("./dist/index.html"));

app.use('/weasel-api', rests);
app.use(router);

app.listen(port, ()=> console.log("Node server running on http://localhost:" + port));
