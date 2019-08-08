import { createServer } from 'http';
import { readFile } from 'fs';
import { parse } from 'url';
import { createMySQLConnection,closeMySQLConnection } from './connection';
import jwt from 'jsonwebtoken';
  
createServer(function (req, res) {
	
	var connection = createMySQLConnection();
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, access-control-allow-origi");

	connection.connect(function(err) {
		try{
			if (err) throw err;
			readQuery(req);			
		}
		catch(e){
			writeAnswer(e.toString(),'text/html');															//connection to db problems
		} 
	});

	function writeAnswer(argumentText, argumentType){
		res.writeHead(200, {'Content-Type': argumentType});
		res.end(argumentText);	
		closeMySQLConnection(connection);
	}

	function readQuery(req){
		if (req.method == 'POST') {
			let body = [];
			req.on('data', (chunk)=>{
				body.push(chunk);
			}).on('end', () => {
				body = Buffer.concat(body).toString();
				var untokenUserDataPair = jwt.verify(JSON.parse(body).userDataPairToken, 'ferropribor');
				readFile('query_users.sql', 'utf-8', (err, text_query) => {
					try{
						if (err) throw err;
						connection.query(text_query, [untokenUserDataPair.email, untokenUserDataPair.hash], function(err, results) {
							try{
								if (err) throw err;
								writeAnswer(JSON.stringify(results),'application/json');							//ok with result from db
							}
							catch(e){
								writeAnswer(e.toString(),'text/html');
							}
						})
					}
					catch(e){
						writeAnswer(e.toString(),'text/html');
					}
				})
			});
		}
		
		if (req.method == 'GET') {
			var inputQueryParams = parse(req.url, true).query;
			readFile('query_'+Object.keys(inputQueryParams)[0]+'_'+inputQueryParams[Object.keys(inputQueryParams)[0]]+'.sql', 'utf-8', (err, text_query) => { 	
				try{
					if (err) throw err;						
					connection.query(text_query, [inputQueryParams.year, inputQueryParams.program_number ? inputQueryParams.program_number : inputQueryParams.channel_number], function(err, results) {
						try{
							if (err) throw err;
							writeAnswer(JSON.stringify(results),'application/json');							//ok with result from db
						}
						catch(e){
							writeAnswer(e.toString(),'text/html');
						}
					});
				}
				catch(e){
					writeAnswer(e.toString(),'text/html');																		//file opening problem
				}			
			})
		}
	}

}).listen(8060);