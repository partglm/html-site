const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const { log } = require('console');
const mysql = require('mysql');

//const sqlite3 = require('sqlite3').verbose();
//
//const db = new sqlite3.Database('ma_base_de_donnees.db');
//db.serialize(() => {
//    db.run(`CREATE TABLE IF NOT EXISTS ban (
//        pseudo_id TEXT PRIMARY KEY,
//    )`);
//
//    db.run(`CREATE TABLE IF NOT EXISTS pseudo (
//        pseudo_id TEXT PRIMARY KEY,
//    )`);
//
//    db.run(`CREATE TABLE IF NOT EXISTS log (
//        log TEXT PRIMARY KEY,
//        date TEXT,
//    )`);
//    console.log('Tables créées avec succès.');
//});


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 443;

const banspeudo = [];
let pseudo = '';
let pseudol = [];
let prenomv = '';
let pseudov = '';
let classev = '';
let nomv = '';
let datat = '';
let f = '';
let e = '';

io.on('connection', (socket) => {
  console.log('Client connecté');
  const log = 'client connecté';
  io.emit('log', (log));
  addToLog(log);
  saveLogToFile();

  socket.on('mdp', (MDP) => {
    console.log(`Mdp reçu : ${MDP}`);
    const log = `quelqu'un a entrée le mdp : ${MDP}`;
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    if (MDP == 'pcmav') {
      socket.emit('mdpok');
      console.log('mdp correct');
      const log = 'mdp correct';
      io.emit('log', (log));
      addToLog(log);
      saveLogToFile();
    };
  });

  socket.on('submit' , (number1,number2,signe) => {
    console.log(`${number1} ${signe} ${number2}`);
    let log = `${number1} ${signe} ${number2}`;
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    let result = 'a'
    if (signe == 'x') {
      result = number1*number2;
    }else{
      if (signe == '/') {
        result = number1/number2;
      }else{
        if (signe == '-') { 
         result = number1-number2;
        }else{
         if (signe == '+') {
          result = number1+number2;
         };   
        };
      };
    };
    result = Math.round(result * 1000) / 1000;
    console.log(result);
    log = result;
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    socket.emit('result', (result));
  });
  
  socket.on('msgv', (msgvalue) => {
    console.log(`Message envoyé :${msgvalue}`);
    const log = msgvalue;
    addToLog(log);
    saveLogToFile();
    const msgsub = msgvalue
    io.emit('message', (msgsub));
  });

  socket.on('speudo', (speudov) => {
    const cheminDuFichier = 'ban.txt';
    fs.readFile(cheminDuFichier, 'utf8', (err, data) => {
      if (err) {
        console.error('Erreur de lecture du fichier : ', err);
        return;
      };
      console.log('Contenu du fichier : ', data);
      datat = data;
    if (datat == speudov) {
      socket.emit('cban', datat);
    }else{
    console.log(`un utilisateur a entrée se speudo: ${speudov}`);
    const log = `quelqu'un a entrée le speudo : ${speudov}`;
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    if (speudov =='partglm' || speudov == 'rafale' || speudov == 'maxou' || speudov == 'Theo_xd' || pseudol) {
      if (speudov == 'partglm') {
       console.log("partglm est connecté");
       const log = 'partglm est connecté';
       io.emit('log', (log));
       addToLog(log);
       saveLogToFile();
       socket.emit('adminok');
      }  
      else 
      {
       socket.emit('speudook');
       console.log('un utilisateur a rejoint');
       const log = 'un utilisateur a rejoint';
       io.emit('log', (log));
       addToLog(log);
       saveLogToFile();
      };
    }
    else 
    {
     //alert('speudo refusée')
     console.log('speudo refuser');
     const log = 'speudo refuser';
     io.emit('log', (log));
     addToLog(log);
     saveLogToFile();
     };
    };
   });
  });
  

  socket.on('ban', banv => {
    banspeudo.push(banv)
    io.emit('cban', banv);
    console.log(`${banv} a bien été ban`);
    const log = `${banv} a bien été ban`;
    const logg = `${banv} /ban `
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    donées(logg);
    fs.appendFileSync('ban.txt', banv, 'utf-8');
  });

  socket.on('rspeud', rspeud => {
    io.emit('rspeud', rspeud);
    console.log(`${rspeud} a bien été kick`);
    const log = `${rspeud} a bien été kick`;
    const logg = `${rspeud} /kick `
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    donées(logg);
  });

  socket.on('rickr', rickr => {
    const rickrr = rickr 
    io.emit('rickrr', rickrr);
    console.log(`${rickr} a bien été rickroll`);
    const log = `${rickr} a bien été rickroll`;
    const logg = `${rickr} /rickroll `
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    donées(logg);
  });

  socket.on('fsis', (formms) => {
    console.log(`${formms}`);
    const log = `${formms}`;
    const logg = `${formms} `;
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    donées(logg);
    let forms =  formms;
    io.emit('fss', (forms));
    io.emit('pré');
  });

  socket.on('fsisse', (pseudovv) => {
   pseudo = pseudovv;
  });

  socket.on('regisc', () => {
    pseudol.push(pseudo);
    console.log(`${pseudo}, a été ajouté au speudo`);
    const log = `${pseudo}, a été ajouté au speudo`;
    const logg = `${pseudo}, a été ajouté au speudo`;
    io.emit('log', (log));
    addToLog(log);
    saveLogToFile();
    donées(logg);
  });
});

let logValues = [];
let doneval = [];

function addToLog(value) {
    const timestamp = new Date().toLocaleString();
    const logEntry = `${timestamp}: ${value}`;
    logValues.push(logEntry);
};
function saveLogToFile() {
    const logContent = logValues.join('\n');
    fs.writeFileSync('logfile.txt', logContent, 'utf-8');
};
function donflie() {
  const logContent = doneval.join('\n');
  fs.writeFileSync('données.txt', logContent, 'utf-8');
};
function donées(done) {
  const timedon = new Date().toLocaleString();
  const donen = `${timedon}: ${done}`;
  doneval.push(donen);
  donflie();
};

app.get('/arreter', (req, res) => {
  console.log('Arrêt du serveur demandé');
  
  const log = 'Arrêt du serveur demandé';
  const clientIp = req.socket.remoteAddress;
  console.log(`IP Address: ${clientIp}`);
  io.emit('log', (log));
  addToLog(log);
  saveLogToFile();
  log = clientIp;
  io.emit('log', (log));
  addToLog(log);
  saveLogToFile();
  process.exit();
}); 

app.get('/cal', (req, res) => {
  console.log('calculatrice : on');
  let log = 'calculatrice : on';
  const clientIp = req.socket.remoteAddress;
  console.log(`IP Address: ${clientIp}`);
  io.emit('log', (log));
  addToLog(log);
  saveLogToFile();
  log = clientIp;
  io.emit('log', (log));
  addToLog(log);
  saveLogToFile();
  res.sendFile(path.join(__dirname, 'calculatrice.html'));
}); 

app.get('/chat', (req,res) => {
  console.log("quelqu'un est sur le chat");
  res.sendFile(path.join(__dirname, 'chat.html'));
  const clientIp = req.socket.remoteAddress;
  console.log(`IP Address: ${clientIp}`);
  let log = clientIp;
  addToLog(log);
  saveLogToFile();
  io.emit('log', (log));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'micode.html'));
  const clientIp = req.socket.remoteAddress;
  console.log(`IP Address: ${clientIp}`);
  let log = clientIp;
  addToLog(log);
  saveLogToFile();
  io.emit('log', (log));
});

app.get('/chat/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
  const clientIp = req.socket.remoteAddress;
  console.log(`IP Address: ${clientIp}`);
  let log = clientIp;
  addToLog(log);
  saveLogToFile();
  io.emit('log', (log));
});


app.get('/403', (req, res) => {
  res.sendFile(path.join(__dirname, '403.jpg'));
  const log = "quelqu'un a été ban"
  console.log(log)
  addToLog(log);
  saveLogToFile();
  io.emit('log', (log));
});

app.get('/401', (req, res) => {
  res.sendFile(path.join(__dirname, '401.jpg'));
  const log = "quelqu'un a été kick"
  console.log(log)
  addToLog(log);
  saveLogToFile();
  io.emit('log', (log));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
  const log = "quelqu'un veut s'enregistrer"
  console.log(log)
  addToLog(log);
  saveLogToFile();
  io.emit('log', (log));
});


app.get('/418', (req, res) => {
  res.sendFile(path.join(__dirname, '418.jpg'));
  const log = "quelqu'un a été rickroll"
  console.log(log)
  addToLog(log);
  saveLogToFile();
  io.emit('log', (log));
});

app.use((req, res) => {
  res.status(404).sendFile('featured_404.jpg', { root: __dirname });
  console.log('error 404 detected');
  let log = 'error 404 detected';
  addToLog(log);
  saveLogToFile();
  io.emit('log', (log));
});

  server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT} on this URL : http://localhost:443`);
});