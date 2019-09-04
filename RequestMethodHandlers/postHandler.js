import { tokens }																				from '../constants/tokens'
import 	 jwt 																						from 'jsonwebtoken';
import { readMySQLQuery}																from '../fs/readQueryFromFile'
import { queryMySQLConnection } 												from '../connection';
import { prepareAnswer }                                from '../helpers/aux_functions'

// Working with POST registration request
// 1. Read file with query
// 2. Insert registration data to db
// 3. Return status answer
export function handlePOST_RegistrationRequest(body, connection) {
  return new Promise((resolve, reject) => {
    var untokenUserDataQuartet = jwt.verify(JSON.parse(body).userDataQuartetToken, tokens.client_side_salt);
    readMySQLQuery('./queries/query_insert_user.sql')
    .then(
      text_query  => queryMySQLConnection(connection, text_query, [untokenUserDataQuartet.email, untokenUserDataQuartet.hash, untokenUserDataQuartet.name, untokenUserDataQuartet.surname]),
      errRead     => reject (prepareAnswer(400, errRead.toString(),       'text/html'))
    )
    .then(
      results     => resolve(prepareAnswer(200, JSON.stringify(results),  'application/json')),
      errQuery    => reject (prepareAnswer(200, errQuery.toString(),      'text/html'))
    )	
  })
}

// Working with POST login request
// 1. Read file with query
// 2. Get login data from db
// 3. If user exists and password is correct - allow login
export function handlePOST_LoginRequest(body, connection) {
  return new Promise((resolve, reject) => {
    var untokenUserDataPair = jwt.verify(JSON.parse(body).userDataPairToken, tokens.client_side_salt);
    readMySQLQuery('./queries/query_search_user.sql')
    .then(
      text_query  => queryMySQLConnection(connection, text_query, [untokenUserDataPair.email, untokenUserDataPair.hash]),
      errRead     => reject (prepareAnswer(400, errRead.toString(),       'text/html'))
    )
    .then(
      results     => {
        if (results[0]){
          var tokenForData = jwt.sign(tokens.client_side_value, tokens.client_side_token);
                    resolve (prepareAnswer(200, JSON.stringify({...JSON.parse(JSON.stringify(results[0])), ...{token: tokenForData}}),  'application/json'))
        }
                    reject  (prepareAnswer(400, JSON.stringify({ message: 'Неправильное имя пользователя или пароль!'}),      'application/json'))
      },
      errQuery   => reject  (prepareAnswer(200, errQuery.toString(),      'text/html'))
    )	
  })
}