import { createServer } 																from 'http';
import { readFile } 																		from 'fs';
import { parse } 																				from 'url';
import { createMySQLConnection,closeMySQLConnection } 	from './connection';
import jwt 																							from 'jsonwebtoken';
  
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
					var untokenUserDataPair = jwt.verify(JSON.parse(body).userDataPairToken, 'ferropribor');
					readFile('query_search_user.sql', 'utf-8', (err, text_query) => {
						try{
							if (err) throw err;
							connection.query(text_query, [untokenUserDataPair.email, untokenUserDataPair.hash], function(err, results) {
								try{
									if (err) throw err;
									var tokenForData = jwt.sign('must_be_a_token', 'ferropribortoken');
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
					var untokenUserDataQuartet = jwt.verify(JSON.parse(body).userDataQuartetToken, 'ferropribor');
					readFile('query_insert_user.sql', 'utf-8', (err, text_query) => {
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
			if(req.headers.authorization){
				if (jwt.verify(req.headers.authorization, 'ferropribortoken')=='must_be_a_token'){ 
					var inputQueryParams = parse(req.url, true).query;
					readFile('query_'+Object.keys(inputQueryParams)[0]+'_'+inputQueryParams[Object.keys(inputQueryParams)[0]]+'.sql', 'utf-8', (err, text_query) => { 	
						try{
							if (err) throw err;						
							connection.query(text_query, [inputQueryParams.year, inputQueryParams.program_number ? inputQueryParams.program_number : inputQueryParams.channel_number], function(err, results) {
								try{
									if (err) throw err;
									writeAnswer(200, JSON.stringify(results), 'application/json');							//ok with result from db
								}
								catch(e){
									writeAnswer(200, e.toString(),'text/html');
								}
							});
						}
						catch(e){
							writeAnswer(200, e.toString(),'text/html');																		//file opening problem
						}			
					})
				}
			}else writeAnswer(401, 'Unauthorised','text/html');
		}

		if (req.method == 'OPTIONS') {
			if(req.headers['access-control-request-headers'] == 'authorization'){				
				res.setHeader("Access-Control-Allow-Headers", "authorization");
			}
			writeAnswer(200, 'HELLO THERE! WE ARE THE BEST INDUSTRIAL INFORMATION SYSTEMS DEVELOPPERS!','text/html');
		}
	}

}).listen(8060);