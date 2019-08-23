import { tokens }																				from '../constants/tokens'
import 	 jwt 																						from 'jsonwebtoken';
import { parse } 																				from 'url';
import { readMySQLQuery}																from '../fs/readQueryFromFile'
import { queryMySQLConnection } 												from '../connection';

function prepareAnswer(responseCode, responseResult, responseType){
  return {responseCode: responseCode, responseResult: responseResult, responseType: responseType};
}

export function handleGETrequest(req, connection) {
  return new Promise((resolve, reject) => {
    if(req.headers.authorization){
      if (jwt.verify(req.headers.authorization, tokens.client_side_token)==tokens.client_side_value){ 
        var inputQueryParams = parse(req.url, true).query;
        readMySQLQuery('./queries/query_' + Object.keys(inputQueryParams)[0] + '_' + inputQueryParams[Object.keys(inputQueryParams)[0]] + '.sql')
        .then(text_query => {
          queryMySQLConnection(connection, text_query, [inputQueryParams.year, inputQueryParams.program_number ? inputQueryParams.program_number : inputQueryParams.channel_number])
            .then(results => {resolve(prepareAnswer(200, JSON.stringify(results), 'application/json'))})
            .catch(err => {reject(prepareAnswer(200, err.toString(), 'text/html'))})
        })
        .catch(err => {
          reject(prepareAnswer(200, err.toString(), 'text/html'));
        })		
      }
    }
    else 
      reject(prepareAnswer(401, 'Unauthorised', 'text/html'));
  })
}