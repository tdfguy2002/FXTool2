// Drag & Drop files for FXTool
// 12-Feb-2019
// May relocated these to fxtool.js


var layerNumber = '';

function overLayerList(layer) {
    console.log("layer: " + layer);
    layerNumber = document.getElementById(layer);
    
    //console.log(layerNumber);

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
        document.getElementById("droptarget").innerHTML = name;
        resetLayerId(layer);
    });
}

function resetLayerId(layer) {
    var newLayerId = document.getElementById('droptarget');
    newLayerId.id = layer;
}



