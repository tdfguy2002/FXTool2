// OXTEL.JS File
// Date 12-Feb-2019


var net = require('net');
var client = new net.Socket();
var templateFiles = new Array;
var imageLoadTallyFiles = new Array;
var timesCalled = 0;

function makeConnection() {
    client.connect(9102, '10.10.154.97');
    //client.connect(9102, '10.24.101.43');
	client.write('Y61');
}


function sendCmd(command) {
	//console.log('sendCmd ...');
	//debugger;
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


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


function displayLoadedTemlates() {
	// put each template filename into td of loaded templates table

}


async function loadStagedTemplates() {
	var command = '';
	for (layerID = 8; layerID > 0; layerID--) {

		var templateFilename = document.getElementById("layer" + layerID).innerHTML;

		//console.log(templateFilename);
		if (templateFilename == ("layer " + layerID)) {
			//console.log("layer empty");
		} else {
			command = "R0" + (layerID - 1) + templateFilename + ":";
			//console.log("formed command: " + command);
			sendCmd(command);
			await sleep(300);
		}
	}
}

function imageLoadTallyHandler(data) {
	console.log("tally handler function " + data.toString());
}


function unloadTemplate() {
	console.log("unload template button clicked");
}


client.on('data', onData);

client.on('close', function (had_error) {
	console.log('closed ...');
});

client.on('error', function (error) {
	console.log(error);
});

// Handle receiving Y9 files list
function receiveImageLoadTally(data, ll) {
    console.log("ll value: " + ll);
    var empty = data.toString().slice(3, 10);
    index = parseInt(ll) + 1;
    aa = data.toString().slice(3, -1);
    //console.log("empty: " + empty);
    
    if (empty == ">Empty<") {
        document.getElementById("loadedLayer" + index).inmerHTML = '';
	} else {
		document.getElementById("loadedLayer" + index).innerHTML = aa;
	}
}



// Handle receiving template file list
function receiveFileList(data) {
	//console.log('Received: ' + data);
	if (data != 'R51end:') {
		templateFiles.push(data);
		client.write('R5$VIDEO:');
	} else if (data == 'R51end:') {
		displayTemplateFiles();
	}

}

//  oxTel response dispatcher
function onData(data) {
	console.log("data being recvd: " + data.toString());

	var oxCode = data.toString().substring(0, 3);
	switch (oxCode) {
		case "R40":
		case "R50":
		case "R51":
			receiveFileList(data);
			break;
		case oxCode.startsWith("R5"):
			break;
		case oxCode.startsWith("UE"):
			break;
		case "Y97":
		case "Y96":
		case "Y95":
		case "Y94":
		case "Y93":
		case "Y92":
		case "Y91":
		case "Y90":
			ll = data.toString().slice(2, 3);
			console.log(ll);
			receiveImageLoadTally(data, ll);
			break;
		default:
			//console.log("unknown oxCode");

	}
}
