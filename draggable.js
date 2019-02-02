

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

/* drag.addEventListener("drag", function(event) {
  	document.getElementById("demo").innerHTML = "The p element is being dragged.";
	});
*/

/* Events fired on the drop target */
// drop.addEventListener("dragover", function(event) {
//     event.preventDefault();
//     //event.target.style.border = "1px solid purple";
// });


// drop.addEventListener("drop", function(event) {

//   	event.preventDefault();
//   	//var data =  "Don Rules!"
//   	data = event.dataTransfer.getData('Text');
//   	var tableRow1 = document.createElement("tr");
//     var fileName1 = document.createTextNode(data);
//   	//event.target.appendChild(document.getElementById(data));
//     document.getElementById("droptarget").innerHTML = name;
  	
// });

// This changes id of dragtarget back to original filename
// drop.addEventListener("dragexit", function(event) {
//     document.getElementById("dragtarget").id = name;
// });

function overLayerList(layer) {
    //event.preventDefault();
    console.log(layer);
    //debugger;

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
        //document.getElementById("droptarget").id = layer;
        resetLayerId(layer);
    });
}

function resetLayerId(layer) {
    var newLayerId = document.getElementById('droptarget');
    newLayerId.id = layer;
}


