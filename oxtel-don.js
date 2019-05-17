// OXTEL.JS File
// Date 12-Feb-2019


var net = require('net');

const Oxtel = require('./oxtel.js');
const FileManager = require('./file-manager.js');
const Graphics = require('./graphics.js');

var client = new net.Socket();
var templateFiles = new Array;
var imageLoadTallyFiles = new Array;
var timesCalled = 0;

var lastLoadedLayerClicked = -1;
var previousLastLoadedLayerClicked = -1;

var stageLayerId = "";
var previousStageLayerId = "";

let oxtel = new Oxtel();
let fileManager = new FileManager();
let graphics = new Graphics();

oxtel.addListener(Oxtel.CONNECTED, () => {
    console.log("Connected");
    fileManager.initialize(oxtel);
});

oxtel.addListener(Oxtel.DISCONNECTED, () => {
    console.log("Disconnected");
    graphics.shutdown();
    fileManager.shutdown();
});

fileManager.addListener(FileManager.READY, () => {
    console.log("filemanager ready");
    graphics.initialize(oxtel);    
});

graphics.addListener(Graphics.READY, () => {
	console.log("graphics ready");
	
	initUI();	
});

function initUI() {
	templateFiles = fileManager.getFileList();
	displayTemplateFiles();

	for (let i = 0; i < 8; i++) {
		document.getElementById("loadedLayer" + (i + 1).toString()).innerHTML = graphics.getLoadedTemplate(i);

		let text = "";
		switch (graphics.getKeyerPosition(i)) {
			case 0: text = "Hidden"; break;
			case 1: text = "Visible"; break;
			case 2: text = "Partial"; break;
		}
		document.getElementById("vis" + (i+ 1).toString()).innerHTML = text;	
	}
}

graphics.addListener(Graphics.TEMPLATE_LOADED, (e) => { 
	console.log("Template loaded: layer: " + e.layer + " filename: " + e.filename);
	var loadedTemplate = document.getElementById("loadedLayer" + (e.layer + 1).toString()).innerHTML = e.filename;
});

graphics.addListener(Graphics.TEMPLATE_UNLOADED, (e) => {
	console.log("Template unloaded: layer: " + e.layer);
	var loadedTemplate = document.getElementById("loadedLayer" + (e.layer + 1).toString()).innerHTML = "";
});  

graphics.addListener(Graphics.KEYER_POSITION_CHANGED, (e) => {     
	console.log("Keyer position changed: layer: " + e.layer + " position: " + e.position);
	let text = "";
	switch (e.position) {
		case 0: text = "Hidden"; break;
		case 1: text = "Visible"; break;
		case 2: text = "Partial"; break;
	}
	document.getElementById("vis" + (e.layer + 1).toString()).innerHTML = text;
});


Graphics.KEYER_POSITION_CHANGED = "Graphics.KEYER_POSITION_CHANGED";

oxtel.connect("10.10.55.67", 9100);

function makeConnection() {
	console.log("making connection");
    client.connect(9100, '10.10.55.67');
    //client.connect(9102, '10.24.101.43');
	client.write('Y61');
}


function sendCmd(command) {
	console.log('sendCmd ...');
	debugger;
	if (client.readyState === 'closed') {
		makeConnection();
	}
	console.log(command);
	client.write(command);
}


function getList() {
	clearList();
	// timesCalled += 1;
	// console.log(timesCalled);
	// sendCmd('R4$VIDEO:');

	templateFiles = fileManager.getFileList();
	displayTemplateFiles();	
	debugger;
}


function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


function displayLoadedTemlates() {
	// put each template filename into td of loaded templates table

}


async function loadStagedTemplates() {
	var command = '';
	var layerID = getLastLayerOver();
	if (layerID > 0) {
		var templateFilename = document.getElementById("layer" + layerID).innerHTML;

		//console.log(templateFilename);
		if (templateFilename == ("layer " + layerID)) {
			console.log("layer empty");
		} else {

			graphics.load(layerID - 1, templateFilename);
			// command = "R0" + (layerID - 1) + templateFilename + ":";
			// //console.log("formed command: " + command);
			// sendCmd(command);
			// await sleep(300);
		}
	}
}

function imageLoadTallyHandler(data) {
	console.log("tally handler function " + data.toString());
}


function unloadTemplate() {
	console.log("unload template button clicked: lastLoadedLayerClicked: " + lastLoadedLayerClicked);
	if (lastLoadedLayerClicked > 0) {
		graphics.unload(lastLoadedLayerClicked - 1);
	}
}

function fadeUp(val) {
	if (lastLoadedLayerClicked > 0) {
		graphics.fade(lastLoadedLayerClicked - 1, 1, val);
	}
}

function fadeDown(val) {
	if (lastLoadedLayerClicked > 0) {
		graphics.fade(lastLoadedLayerClicked - 1, 0, val);
	}
}

function onStageLayerClicked(id) {
	console.log("onStageLayerClicked: id: " + id);

	let element = document.getElementById(previousStageLayerId);
	if (element) {
		element.style.backgroundColor = null;	
	}

	element = document.getElementById(id);
	if (element) {
		element.style.backgroundColor = "#5EC4DB";
	}

	stageLayerId = id;
	previousStageLayerId = stageLayerId;
}

function onLoadedLayerClicked(layer) {
	console.log("onLoadedLayerClicked: layer: " + layer);

	if (previousLastLoadedLayerClicked > 0) {
		let loadedLayer = document.getElementById("loadedLayer" + previousLastLoadedLayerClicked);
		let vis = document.getElementById("vis" + previousLastLoadedLayerClicked);
		loadedLayer.style.backgroundColor = null;
		vis.style.backgroundColor = null;	
	}	

	let loadedLayer = document.getElementById("loadedLayer" + layer);
	let vis = document.getElementById("vis" + layer);

	loadedLayer.style.backgroundColor = "#6BC6DB";
	vis.style.backgroundColor = "#6BC6DB";

	lastLoadedLayerClicked = layer;
	previousLastLoadedLayerClicked = lastLoadedLayerClicked;
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
}


//
// when data is received, parse into token by looking at header and tail 
//

class ReceivedData {
	constructor(oxtelData) {
		this._oxtelData = oxtelData;
	}
}

// each token can more than one property
// this will vary how the 