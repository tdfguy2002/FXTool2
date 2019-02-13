// OXTEL.JS File
// Date 12-Feb-2019


var net = require('net');
var client = new net.Socket();
var templateFiles = new Array;
var timesCalled = 0;

function makeConnection() {
    client.connect(9102, '10.10.154.97');
}


function sendCmd(command) {
    console.log('sendCmd ...');
    //debugger;
    if (client.readyState === 'closed') {
        makeConnection();
    }
    client.write(command);
}


function getList() {
    clearList();
    timesCalled += 1;
    console.log(timesCalled);
    sendCmd('R4$VIDEO:');
    //debugger;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function loadStaged() {
    var command = '';
    for (layerID = 8; layerID > 0; layerID--) {

        var templateFilename = document.getElementById("layer" + layerID).innerHTML;
                 
        console.log(templateFilename);
        if (templateFilename == ("layer " + layerID)) {
            //console.log("layer empty");
         } else {
            command = "R0" + (layerID - 1) + templateFilename + ":";
            console.log("formed command: " + command);
            sendCmd(command);
            await sleep(300);
         }       
    }    
}


function unloadTemplate() {
    console.log("unload template button clicked");
}


client.on('data', onData);

client.on('close', function(had_error) {
    console.log('closed ...');
});

client.on('error', function(error) {
    console.log(error);
});

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
		default:
			console.log("unknown oxCode");

	}
}

