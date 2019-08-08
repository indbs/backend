var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'GeneralTimeline_Request',
  script: require('path').join(__dirname,'start.js')
  //script: 'C:\\js\\testmysql\\start.js'
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();

//npm link node-windows!!!!!!!!!!
//in console under admin!

//проверка зависающей службы
//netstat -ano | find "LISTENING" | find "8060"
//-kill-
//taskkill /pid 14828
//-force kill-
//taskkill /pid 14828 /f