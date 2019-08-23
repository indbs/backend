export function handleOPTIONSrequest(req, res) {
  if(req.headers['access-control-request-headers'] == 'authorization'){				
    res.setHeader("Access-Control-Allow-Headers", "authorization");
  }
  return 'HELLO THERE! WE ARE THE BEST INDUSTRIAL INFORMATION SYSTEMS DEVELOPPERS!'
}
