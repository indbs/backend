import { createServer } from 'http';
import { readFile } from 'fs';
import { parse } from 'url';
import { createMySQLConnection,closeMySQLConnection } from './connection';
  
createServer(function (req, res) {
	
	var connection = createMySQLConnection();
	res.setHeader("Access-Control-Allow-Origin", "*");

	connection.connect(function(err) {
		try{
			if (err) throw err;
			readQuery(parse(req.url, true).query);
			
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

	function readQuery(inputQueryParams){
		var mySQLrequestParams=[inputQueryParams.year, inputQueryParams.program_number];
		console.log(mySQLrequestParams);
		readFile('query_'+Object.keys(inputQueryParams)[0]+'_'+inputQueryParams[Object.keys(inputQueryParams)[0]]+'.sql', 'utf-8', (err, text_query) => { 
			console.log(text_query);	
			try{
				if (err) throw err;						
				connection.query(text_query, mySQLrequestParams, function(err, results) {
					if (err) throw err;
					
					writeAnswer(JSON.stringify(results),'application/json');								//ok with result from db
				});
			}
			catch(e){
				writeAnswer(e.toString(),'text/html');														//file opening problem
			}			
		})
	}

}).listen(8060);