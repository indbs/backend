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

			if (parse(req.url, true).query.generaltimeline){									//timeline data generating			
				readFile('query_generaltimeline_'+parse(req.url, true).query.generaltimeline+'.sql', 'utf-8', (err, text_query) => { 
					try{
						if (err) throw err;						
						connection.query(text_query, function(err, results) {
							if (err) throw err;
							
							writeAnswer(JSON.stringify(results),'application/json');								//ok with result from db
						});
					}
					catch(e){
						writeAnswer(e.toString(),'text/html');														//file opening problem
					}			
				})
			}
			if (parse(req.url, true).query.graph){												//graph data generating	
				readFile('query_graph_'+parse(req.url, true).query.graph+'.sql', 'utf-8', (err, text_query) => { 
					try{
						if (err) throw err;						
						connection.query(text_query, [parse(req.url, true).query.year,parse(req.url, true).query.program_number], function(err, results) {
							if (err) throw err;
							
							writeAnswer(JSON.stringify(results),'application/json');								//ok with result from db
						});
					}
					catch(e){
						writeAnswer(e.toString(),'text/html');														//file opening problem
					}			
				})
			}
		}
		catch(e){
			writeAnswer(e.toString(),'text/html');																	//connection to db problems
		} 
	});

	function writeAnswer(argumentText, argumentType){
		res.writeHead(200, {'Content-Type': argumentType});
		res.end(argumentText);	
		closeMySQLConnection(connection);
	}

}).listen(8060);