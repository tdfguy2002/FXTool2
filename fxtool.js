
var net2 = require('net');
var client2 = new net2.Socket();


function sendCmd2(command) {
	client2.connect(9102, '10.10.154.97', function () {
		console.log("from send function: " + command);
        client2.write(command);
        client2.end(); 
        //await client2.close();
    });
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
            sendCmd2(command);
            await sleep(300);
         } 
        
    }
     
}

function unloadTemplate() {
    alert("unload was clickified");
}