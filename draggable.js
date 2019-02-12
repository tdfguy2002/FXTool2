// Drag & Drop files for FXTool
// 12-Feb-2019
// May relocated these to fxtool.js


var drag = document.getElementById("dragtarget");
console.log(drag);


var drop = document.getElementById("droptarget");
console.log(drop);

/* Events fired on the drag target */

drag.addEventListener("dragstart", function(event) {
    console.log(event.target.id);
    event.dataTransfer.setData("Text", event.target.id);
    console.log("event.target.id: " + event.target.id);
});


function overLayerList(layer) {
    var layId = document.getElementById(layer);
    console.log(layId);
    layId.id = "droptarget";
    var drop = document.getElementById("droptarget");
    drop.addEventListener("dragover", function(event) {
       event.preventDefault();
    event.target.style.border = "1px solid purple";
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



