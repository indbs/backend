var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'GeneralTimeline_Request',
  description: 'JSON data for GeneralTimeLine',
  script: 'C:\\js\\testmysql\\start.js',
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ]
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();

//npm link node-windows!!!!!!!!!!
//in console under admin!