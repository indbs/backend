import { createServer } 																from 'http';
import { createMySQLConnection,
				 makeMySQLConnection } 													from './connection';
import { handleOPTIONSrequest }													from './RequestMethodHandlers/optionsHandler'
import { handleGETrequest }															from './RequestMethodHandlers/getHandler'
import { handlePOST_RegistrationRequest,
				 handlePOST_LoginRequest}												from './RequestMethodHandlers/postHandler'
	
function createCon(){
	return createMySQLConnection();
}			

function makeCon(req, res, con){
	return makeMySQLConnection(con)
		.then(
			readQuery(req, res, con),
			(error) => writeAnswer(res, error)
		)
}

export function readQuery(req, res, connection){
	if (req.method == 'POST') {
		let body = [];
		req.on('data', (chunk)=>{
			body.push(chunk);
		}).on('end', () => {																														//receiving body data from http
			body = Buffer.concat(body).toString();
			if (JSON.parse(body).userDataPairToken){
				handlePOST_LoginRequest(body, connection)
					.then(
						(result) 	=> writeAnswer(req, res, result),
						(error) 	=> writeAnswer(req, res, error)
					)
			}
			if (JSON.parse(body).userDataQuartetToken){
				handlePOST_RegistrationRequest(body, connection)
					.then(
						(result) 	=> writeAnswer(req, res, result),
						(error) 	=> writeAnswer(req, res, error)
					)
			}
		});
	}
	
	if (req.method == 'GET') {
		handleGETrequest(req, connection)
			.then(
				(result) 	=> writeAnswer(req, res, result),
				(error) 	=> writeAnswer(req, res, error)
			)
	}

	if (req.method == 'OPTIONS') {
	handleOPTIONSrequest(req, res)
		.then(
			(result) 		=> writeAnswer(req, res, result),
			(error) 		=> writeAnswer(req, res, error)
		)
	}
}

createServer(function (req, res) {
	
	var connection = createCon();
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, access-control-allow-origin");

	makeCon(req, res, connection);

}).listen(8060);

function writeAnswer(req, res, content){
	res.writeHead(content.responseCode, {'Content-Type': content.responseType});
	res.end(content.responseResult);
	
	return res;
}