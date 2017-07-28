'use strict';const port=+(process.env.PORT||3002),express=require('express'),app=express(),bodyParser=require('body-parser'),methodOverride=require('method-override'),open=require('open');let _process=require('./controllers/process');app.use(bodyParser.urlencoded({extended:!1})),app.use(bodyParser.json()),app.use(methodOverride()),app.use(bodyParser.json({limit:'50mb'})),app.use(bodyParser.urlencoded({limit:'50mb',extended:!0})),app.use(express.static('dist'));const router=express.Router(),rests=express.Router();app.use((a,b,c)=>{b.setHeader('Access-Control-Allow-Origin','*'),b.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE'),b.setHeader('Access-Control-Allow-Headers','content-type','application/json'),c()}),rests.route('/import-from-chrome').post(_process.importFromChrome),rests.route('/clean-all').get(_process.cleanAll),rests.route('/list/folders').get(_process.listFolders),rests.route('/list/folders/:name').get(_process.listFoldersByName),rests.route('/list/rests').get(_process.listRests),rests.route('/list/options').get(_process.listOptions),rests.route('/import/folder/:name/:addRest').post(_process.importFolder),rests.route('/add/group/:name').post(_process.addGroup),rests.route('/add/folder/:name').post(_process.addFolder),rests.route('/add/rest/:name').post(_process.addRest),rests.route('/add/rest-folder/:name').post(_process.addRestToFolder),rests.route('/delete/folder/:name').post(_process.deleteFolder),rests.route('/delete/rest/:name').post(_process.deleteRest),rests.route('/edit/folder/:name/:old').post(_process.editFolder),rests.route('/edit/rest/:name').post(_process.editRest),rests.route('/remove/group/:nameDirectory/:nameGroup').get(_process.removeGroup),rests.route('/remove/rest/:name').post(_process.removeRest),rests.route('/options').post(_process.saveOptions),rests.route('/start/:name').post(_process.start),rests.route('/kill').get(_process.kill),app.get('/',(a,b)=>b.sendFile(`__dirname /index.html`)),app.use('/weasel-api',rests),app.use(router),app.listen(port,()=>console.log('Node server running on http://localhost:'+port));