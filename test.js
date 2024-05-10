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
    console.log('qqadebanviendessayer');
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
