import { createServer } 																from 'http';
import { createMySQLConnection,
				 closeMySQLConnection,
				 makeMySQLConnection } 													from './connection';
import { handleOPTIONSrequest }													from './RequestMethodHandlers/optionsHandler'
import { handleGETrequest }															from './RequestMethodHandlers/getHandler'
import { handlePOST_RegistrationRequest,
				 handlePOST_LoginRequest}												from './RequestMethodHandlers/postHandler'
  
createServer(function (req, res) {
	
	var connection = createMySQLConnection();
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, access-control-allow-origin");

	makeMySQLConnection(connection)
		.then(
			readQuery(req),
			(error) 	=> writeAnswer(error.responseCode, error.responseResult, error.responseType)
		)

	function readQuery(req){
		if (req.method == 'POST') {
			let body = [];
			req.on('data', (chunk)=>{
				body.push(chunk);
			}).on('end', () => {																														//receiving body data from http
				body = Buffer.concat(body).toString();
				if (JSON.parse(body).userDataPairToken){
					handlePOST_LoginRequest(body, connection)
						.then(
							(result) 	=> writeAnswer(result.responseCode, result.responseResult, result.responseType),
							(error) 	=> writeAnswer(error.responseCode, error.responseResult, error.responseType)
						)
				}
				if (JSON.parse(body).userDataQuartetToken){
					handlePOST_RegistrationRequest(body, connection)
						.then(
							(result) 	=> writeAnswer(result.responseCode, result.responseResult, result.responseType),
							(error) 	=> writeAnswer(error.responseCode, error.responseResult, error.responseType)
						)
				}
			});
		}
		
		if (req.method == 'GET') {
			handleGETrequest(req, connection)
				.then(
					(result) 	=> writeAnswer(result.responseCode, result.responseResult, result.responseType),
					(error) 	=> writeAnswer(error.responseCode, error.responseResult, error.responseType)
				)
		}

		if (req.method == 'OPTIONS') {
		handleOPTIONSrequest(req, res)
			.then(
				(result) 		=> writeAnswer(result.responseCode, result.responseResult, result.responseType),
				(error) 		=> writeAnswer(error.responseCode, error.responseResult, error.responseType)
			)
		}
	}

	function writeAnswer(status, argumentText, argumentType){
		res.writeHead(status, {'Content-Type': argumentType});
		res.end(argumentText);	
		closeMySQLConnection(connection);
	}

}).listen(8060);