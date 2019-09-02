import { prepareAnswer }                                from '../helpers/aux_functions'

export function handleOPTIONSrequest(req, res) {
  return Promise.resolve(prepareAnswer(200, 'HELLO THERE! WE ARE THE BEST INDUSTRIAL INFORMATION SYSTEMS DEVELOPPERS!', 'text/html')); 
  /*return new Promise((resolve, reject) => {
    resolve(prepareAnswer(200, 'HELLO THERE! WE ARE THE BEST INDUSTRIAL INFORMATION SYSTEMS DEVELOPPERS!', 'text/html'))
  })*/
}