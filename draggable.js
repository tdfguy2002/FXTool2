// Drag & Drop files for FXTool
// 12-Feb-2019
// May relocated these to fxtool.js


var layerNumber = '';
var lastLayerOver = -1;

function getLastLayerOver() {
    return lastLayerOver;
}

function overLayerList(layer) {
    console.log("layer: " + layer);
    layerNumber = document.getElementById(layer);

    lastLayerOver = parseInt(layer.slice(5));
    console.log("lastLayerOver: " + lastLayerOver);
    
    // console.log(layerNumber);

    if (layerNumber) {
        layerNumber.id = "droptarget";
        var drop = document.getElementById("droptarget");
        drop.addEventListener("dragover", function(event) {
        event.preventDefault();
        });


        drop.addEventListener("drop", function(event) {

            event.preventDefault();
            data = event.dataTransfer.getData('Text');
            var tableRow1 = document.createElement("tr");
            var fileName1 = document.createTextNode(data);
            var droptarget = document.getElementById("droptarget")
            if (droptarget) {
                console.log(layerNumber);
                // debugger;
                droptarget.innerHTML = name;
            }
            resetLayerId(layer);
        });
    }
}

function resetLayerId(layer) {
    var newLayerId = document.getElementById('droptarget');
    if (newLayerId) {
        newLayerId.id = layer;
    }
}



