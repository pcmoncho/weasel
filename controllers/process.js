'use strict';const fork=require('child_process').fork,fs=require('fs');let folders=require('../resources/folders'),resources=require('../resources/rests'),currentProcess=require('../resources/current-process'),options=require('../resources/options'),process;exports.importFromChrome=(a,b)=>{let c=a.body;console.log(c),b.status(200).jsonp('ITS WORK')},exports.cleanAll=(a,b)=>{fs.writeFile('resources/folders.json',JSON.stringify([{id:1,name:'root',content:[],folders:[]}]),c=>{c&&b.status(500).send(c),fs.writeFile('resources/rests.json',JSON.stringify([]),d=>{d&&b.status(500).send(d),fs.writeFile('resources/current-process.json',JSON.stringify([]),e=>{e&&b.status(500).send(e),b.status(200).jsonp('CLEANED')})})})},exports.listFolders=(a,b)=>{let c;c=folders.filter(d=>d.content.length),c.length||b.status(200).send({error:'No tiene servicios'}),b.status(200).jsonp(c)},exports.listFoldersByName=(a,b)=>{let c=a.params.name,d;d=folders.find(e=>e.name===c),d||b.status(500).send('Unknown folder'),b.status(200).jsonp(d)},exports.listRests=(a,b)=>{b.status(200).jsonp(resources)},exports.importFolder=(a,b)=>{let c=a.params.name,d=-1,e=parseInt(a.params.addRest,10),f=a.body,g=!1;if(d=folders.findIndex(h=>h.name===c),folders.forEach(h=>{h.name===f.name&&(g=!0)}),g)b.status(200).send({error:'Name of folder already exist'});else if(e){let h='';g=!1,f.content.forEach(i=>{resources.forEach(j=>{i.name===j.name&&(h=j.name,g=!0)})}),g?b.status(200).send({error:`Name of rest ${h} already exist`}):(folders.push(f),folders[d].folders.push(f.name),fs.writeFile('resources/folders.json',JSON.stringify(folders),i=>{i&&b.status(500).send(i),f||b.status(200).jsonp(folders[d])}),f.content.forEach(i=>{resources.push(i)}),fs.writeFile('resources/rests.json',JSON.stringify(resources),i=>{i&&b.status(500).send(i),b.status(200).jsonp(folders[d])}))}else folders.push(f),folders[d].folders.push(f.name),fs.writeFile('resources/folders.json',JSON.stringify(folders),h=>{h&&b.status(500).send(h),b.status(200).jsonp(folders[d])})},exports.addGroup=(a,b)=>{let c=!1,d=a.params.name,e=a.body,f={},g=-1;f=folders.find(h=>h.name===d),g=folders.findIndex(h=>h.name===d),console.log(f),f.hasOwnProperty('groups')?f.groups.forEach(h=>{h.name===e.name&&(c=!0)}):f.groups=[],c?b.status(200).send({error:`Group ${e.name} already exist in the directory`}):(f.groups.push(e),folders[g]=f,fs.writeFile('resources/folders.json',JSON.stringify(folders),h=>{h&&b.status(500).send(h),b.status(200).jsonp(folders[g])}))},exports.addFolder=(a,b)=>{let c=!1,d=a.params.name,e=a.body,f={},g=-1;f=folders.find(h=>h.name===d),g=folders.findIndex(h=>h.name===d),f.folders.forEach(h=>{h===e.name&&(c=!0)}),c?b.status(500).send('ELEMENT DUPLICATED'):(folders.push(e),folders[g].folders.push(e.name),fs.writeFile('resources/folders.json',JSON.stringify(folders),h=>{h&&b.status(500).send(h),b.status(200).jsonp(folders[g])}))},exports.addRest=(a,b)=>{let c=!1,d=a.params.name,e=a.body,f={},g=-1;f=folders.find(h=>h.name===d),g=folders.findIndex(h=>h.name===d),resources.forEach(h=>{h.name===e.name&&(c=!0)}),c?b.status(200).send({error:`Name of rest ${e.name} is duplicated`}):(resources.push(e),folders[g].content.push(e),fs.writeFile('resources/folders.json',JSON.stringify(folders),h=>{h&&b.status(500).send(h),fs.writeFile('resources/rests.json',JSON.stringify(resources),i=>{i&&b.status(500).send(i),b.status(200).send(e)})}))},exports.deleteFolder=(a,b)=>{let c=a.body.name,d=a.params.name,e=[],f=-1,g=-1,h=[];f=folders.findIndex(i=>i.name===c),g=folders.findIndex(i=>i.name===d),folders.forEach((i,j)=>{let k=i.folders.indexOf(c);-1!==k&&e.push([j,k])}),e.forEach(i=>{folders[i[0]].folders.splice(i[1],1)}),getTreeIndexs(folders,f,h),h.reverse().forEach(i=>folders.splice(i,1)),fs.writeFile('resources/folders.json',JSON.stringify(folders),i=>{i&&b.status(500).send(i),b.status(200).jsonp(folders[g])})},exports.deleteRest=(a,b)=>{let c=a.params.name,d=a.body,e=[],f=-1,g=-1;g=folders.findIndex(h=>h.name===c),resources.forEach((h,i)=>{h.name===d.name&&(f=i)}),folders.forEach((h,i)=>{let j=-1;h.content.forEach((k,l)=>{k.name===d.name&&(j=l)}),-1!==j&&e.push([i,j])}),e.forEach(h=>{folders[h[0]].content.splice(h[1],1)}),resources.splice(f,1),fs.writeFile('resources/folders.json',JSON.stringify(folders),h=>{h&&b.status(500).send(h),fs.writeFile('resources/rests.json',JSON.stringify(resources),i=>{i&&b.status(500).send(i),b.status(200).jsonp(folders[g])})})},exports.editFolder=(a,b)=>{let c=a.params.name,d=a.params.old,e=a.body,f=-1,g=-1,h=-1;f=folders.findIndex(i=>i.name===d),g=folders.findIndex(i=>i.name===c),h=folders[g].folders.findIndex(i=>i===d),folders[f].name=e.name,folders[g].folders[h]=e.name,fs.writeFile('resources/folders.json',JSON.stringify(folders),i=>{i&&b.status(500).send(i),b.status(200).jsonp(folders[g])})},exports.editRest=(a,b)=>{let c=!1,d=a.params.name,e=a.body,f={},g=-1,h=-1,i=[];f=folders.find(j=>j.name===d),g=folders.findIndex(j=>j.name===d),f.content.forEach(j=>{j.name===e.name&&(c=!0)}),resources.forEach((j,k)=>{j.name===e.name&&(h=k)}),c&&(resources.splice(h,1),folders.forEach((j,k)=>{let l=-1;j.content.forEach((m,n)=>{m.name===e.name&&(l=n)}),-1!==l&&i.push([k,l])}),i.forEach(j=>{folders[j[0]].content.splice(j[1],1)})),resources.push(e),folders[g].content.push(e),fs.writeFile('resources/folders.json',JSON.stringify(folders),j=>{j&&b.status(500).send(j),fs.writeFile('resources/rests.json',JSON.stringify(resources),k=>{k&&b.status(500).send(k),b.status(200).jsonp(folders[g])})})};function getTreeIndexs(a,b,c){c.push(b);a[b].folders.length&&a[b].folders.forEach(d=>{let e=-1;a.forEach((f,g)=>{f.name===d&&(e=g)}),getTreeIndexs(a,e,c)})}exports.removeGroup=(a,b)=>{let c=a.params.nameDirectory,d=a.params.nameGroup,e=-1,f=-1;e=folders.findIndex(g=>g.name===c),f=folders[e].groups.findIndex(g=>g.name===d),folders[e].groups.splice(f,1),fs.writeFile('resources/folders.json',JSON.stringify(folders),g=>{g&&b.status(500).send(g),b.status(200).jsonp(folders[e])})},exports.removeRest=(a,b)=>{let c=a.params.name,d=-1,e={},f=-1,g=a.body;e=folders.find(h=>h.name===c),d=folders.findIndex(h=>h.name===c),f=e.content.findIndex(h=>h.name===g.name),folders[d].content.splice(f,1),fs.writeFile('resources/folders.json',JSON.stringify(folders),h=>{h&&b.status(500).send(h),b.status(200).jsonp(folders[d])})},exports.addRestToFolder=(a,b)=>{let c=a.params.name,d=a.body,e=-1;e=folders.findIndex(f=>f.name===c),folders[e].content.push(d),fs.writeFile('resources/folders.json',JSON.stringify(folders),f=>{f&&b.status(500).send(f),b.status(200).jsonp(folders[e])})},exports.listOptions=(a,b)=>{b.status(200).jsonp(options)},exports.saveOptions=(a,b)=>{console.log(options.port),console.log(a.body.port),options.port=a.body.port,fs.writeFile('resources/options.json',JSON.stringify(options),c=>{c&&b.status(500).send(c),b.status(200).send('SUCCESS')})},exports.start=(a,b)=>{let c=-1;const d=a.body;c=folders.findIndex(e=>e.name===a.params.name),folders[c].hasOwnProperty('groups')&&folders[c].groups.forEach(e=>{e.content.forEach(f=>d.push(f))}),fs.writeFile('resources/current-process.json',JSON.stringify(d),e=>{e&&b.status(500).send(e);let f=fork('index');f.on('message',g=>b.status(200).send(g)),process=f,b.status(200).send('OK')})},exports.kill=(a,b)=>{console.info('Finish Him!'),process&&process.kill(),b.status(200).send({msg:'Finish Him!'})};