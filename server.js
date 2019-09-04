import { createServer } 																from 'http';
import { createMySQLConnection,
				 makeMySQLConnection } 													from './connection';
import { handleOPTIONSrequest }													from './RequestMethodHandlers/optionsHandler'
import { handleGETrequest }															from './RequestMethodHandlers/getHandler'
import { handlePOST_RegistrationRequest,
				 handlePOST_LoginRequest }											from './RequestMethodHandlers/postHandler'

// Gives the connection
function createCon(){
	return createMySQLConnection();
}			

// Makes connection, read request, gives response
function makeCon(req, res, con){
	return makeMySQLConnection(con)
		.then(
			() => readQuery(req, res, con),
			error => writeAnswer(req, res, error)
		)
		.then(
			result 	=> {
				writeAnswer(req, res, result);
			},
			error => writeAnswer(req, res, error)
		)
}

// Reading request
export function readQuery(req, res, connection){
	return new Promise((resolve, reject) => {
		if (req.method == 'POST') {
			let body = [];
			req.on('data', (chunk)=>{
				body.push(chunk);
			}).on('end', () => {																										
				body = Buffer.concat(body).toString();
				if (JSON.parse(body).userDataPairToken){
					handlePOST_LoginRequest(body, connection)
						.then(
							result 	=> resolve(result), 
							error 	=> reject(error)		
						)
				}
				if (JSON.parse(body).userDataQuartetToken){
					handlePOST_RegistrationRequest(body, connection)
						.then(
							result 	=> resolve(result), 
							error 	=> reject(error)
						)
				}
			});
		}
		
		if (req.method == 'GET') {
			handleGETrequest(req, connection)
				.then(
					result 	=> resolve(result), 
					error 	=> reject(error)	
				)
		}

		if (req.method == 'OPTIONS') {
			if(req.headers['access-control-request-headers'] == 'authorization'){				
				res.setHeader("Access-Control-Allow-Headers", "authorization");
			}
			handleOPTIONSrequest(req, res)
				.then(
					result 	=> resolve(result), 
					error 	=> reject(error)
				)
		}
	})
}

// Entry point
createServer(function (req, res) {
	
	var connection = createCon();
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, access-control-allow-origin");

	makeCon(req, res, connection);

}).listen(8060);

// Exit point
function writeAnswer(req, res, result){
	res.writeHead(result.responseCode, {'Content-Type': result.responseType});
	res.end(result.responseResult);
}