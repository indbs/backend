import { prepareAnswer }                                from '../helpers/aux_functions'

// Working with OPTION request
// 1. Return only OK response with Allow-Headers -> Autorization in upper code. Needed only for prefly requests.
export function handleOPTIONSrequest(req, res) {
  return Promise.resolve(prepareAnswer(200, 'HELLO THERE! WE ARE THE BEST INDUSTRIAL INFORMATION SYSTEMS DEVELOPPERS!', 'text/html')); 
  /*return new Promise((resolve, reject) => {
    resolve(prepareAnswer(200, 'HELLO THERE! WE ARE THE BEST INDUSTRIAL INFORMATION SYSTEMS DEVELOPPERS!', 'text/html'))
  })*/
}