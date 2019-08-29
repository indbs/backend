import { prepareAnswer }                                from '../helpers/aux_functions'

export function handleOPTIONSrequest(req, res) {
  if(req.headers['access-control-request-headers'] == 'authorization'){				
    res.setHeader("Access-Control-Allow-Headers", "authorization");
  }
  return Promise.resolve(prepareAnswer(200, 'HELLO THERE! WE ARE THE BEST INDUSTRIAL INFORMATION SYSTEMS DEVELOPPERS!', 'text/html')); 
}