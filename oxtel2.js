// OXTEL.JS File
// Date 12-Feb-2019


var net = require('net');
var client = new net.Socket();
var templateFiles = new Array;
var imageLoadTallyFiles = new Array;
var timesCalled = 0;

function makeConnection() {
    client.connect(9102, '10.10.154.97');
	client.write('Y61');
}


function sendCmd(command) {
	if (client.readyState === 'closed') {
		makeConnection();
	}
	console.log(command);
	client.write(command);
}


function getList() {
	clearList();
	timesCalled += 1;
	//console.log(timesCalled);
	sendCmd('R4$VIDEO:');
	//debugger;
}



function unloadTemplate() {
	console.log("unload template button clicked");
}


client.on('data', onData);


//  oxTel response dispatcher
function onData(data) {
// 	console.log("data being recvd: " + data.toString());
// 	var oxCode = data.toString().substring(0, 3);
// 	switch (oxCode) {
// 		case "R40":
// 		case "R50":
// 		case "R51":
// 			receiveFileList(data);
// 			break;
// 		case oxCode.startsWith("R5"):
// 			break;
// 		case oxCode.startsWith("UE"):
// 			break;
// 		case "Y97":
// 		case "Y96":
// 		case "Y95":
// 		case "Y94":
// 		case "Y93":
// 		case "Y92":
// 		case "Y91":
// 		case "Y90":
// 			ll = data.toString().slice(2, 3);
// 			console.log(ll);
// 			receiveImageLoadTally(data, ll);
// 			break;
// 		default:
// 			//console.log("unknown oxCode");

// 	}
// }


//
// when data is received, parse into token by looking at header and tail 
//

class oxtelDataReceived {
	constructor(oxtelData) {
		this._oxteldata = oxtelData;
		this._header = oxtelData.toString().substring(0,2);
		this._payload = oxtelData.toString().substring(3,)
	}
}

// each token can more than one property
// this will vary how the 

// Private Functions
_getTemplateFileList() {
	
}

let oxData = new oxtelDataReceived()