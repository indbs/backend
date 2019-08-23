import { createServer } 																from 'http';
import { readFile } 																		from 'fs';
import { parse } 																				from 'url';
import { createMySQLConnection,
				 closeMySQLConnection,
				 queryMySQLConnection } 												from './connection';
import 	 jwt 																						from 'jsonwebtoken';
import { handleOPTIONSrequest }													from './RequestMethodHandlers/optionsHandler'
import { handleGETrequest }															from './RequestMethodHandlers/getHandler'
import { tokens }																				from './constants/tokens'
import { readMySQLQuery}																from './fs/readQueryFromFile'
  
createServer(function (req, res) {
	
	var connection = createMySQLConnection();
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, access-control-allow-origin");

	connection.connect(function(err) {
		try{
			if (err) throw err;
			readQuery(req);			
		}
		catch(e){
			writeAnswer(e.toString(),'text/html');																					//connection to db problems
		} 
	});

	function writeAnswer(status, argumentText, argumentType){
		res.writeHead(status, {'Content-Type': argumentType});
		res.end(argumentText);	
		closeMySQLConnection(connection);
	}

	function readQuery(req){
		if (req.method == 'POST') {
			let body = [];
			req.on('data', (chunk)=>{
				body.push(chunk);
			}).on('end', () => {																														//receiving body data from http
				body = Buffer.concat(body).toString();
				if (JSON.parse(body).userDataPairToken){
					var untokenUserDataPair = jwt.verify(JSON.parse(body).userDataPairToken, tokens.client_side_salt);
					readFile('./queries/query_search_user.sql', 'utf-8', (err, text_query) => {
						try{
							if (err) throw err;
							connection.query(text_query, [untokenUserDataPair.email, untokenUserDataPair.hash], function(err, results) {
								try{
									if (err) throw err;
									var tokenForData = jwt.sign(tokens.client_side_value, tokens.client_side_token);
									if (results[0])	writeAnswer(200, JSON.stringify({...JSON.parse(JSON.stringify(results[0])), ...{token: tokenForData}}),'application/json');
									else	writeAnswer(400, JSON.stringify({ message: 'Неправильное имя пользователя или пароль!'}),'application/json');	//ok with result from db						
								}	
								catch(e){
									writeAnswer(200, e.toString(),'text/html');
								}
							})
						}
						catch(e){
							writeAnswer(200, e.toString(),'text/html');
						}
					})
				}
				if (JSON.parse(body).userDataQuartetToken){
					var untokenUserDataQuartet = jwt.verify(JSON.parse(body).userDataQuartetToken, tokens.client_side_salt);
					readFile('./queries/query_insert_user.sql', 'utf-8', (err, text_query) => {
						try{
							if (err) throw err;
							connection.query(text_query, [untokenUserDataQuartet.email, untokenUserDataQuartet.hash, untokenUserDataQuartet.name, untokenUserDataQuartet.surname], function(err, results) {
								try{
									if (err) throw err;
									if (results)	writeAnswer(200, JSON.stringify(results), 'application/json');
									else	writeAnswer(400, JSON.stringify({ message: 'Что-то пошло не так!..'}),'application/json');	//ok with result from db						
								}	
								catch(e){
									writeAnswer(200, e.toString(),'text/html');
								}
							})
						}
						catch(e){
							writeAnswer(200, e.toString(),'text/html');
						}
					})
				}
			});
		}
		
		if (req.method == 'GET') {
			handleGETrequest(req, connection)
				.then((result) => {
					writeAnswer(result.responseCode, result.responseResult, result.responseType);
				})
				.catch((result) => {
					writeAnswer(result.responseCode, result.responseResult, result.responseType);
				})
		}

		if (req.method == 'OPTIONS') {
			writeAnswer(200, handleOPTIONSrequest(req, res), 'text/html');
		}
	}

}).listen(8060);