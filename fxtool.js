// FX Tool in Electron.js
// Date: Jan 2019



function displayTemplateFiles() {
    //console.log(templateFiles.toString());
    templateFiles.forEach(function (value) {
        var x = value.toString().lastIndexOf('.');
        var tableRow = document.createElement("tr");
        var fileName = document.createTextNode(value.toString().slice(3, -1));

        tableRow.appendChild(fileName);

        tableRow.onmouseover = function () {
            name = value.toString().slice(3, -1);                       /* set name to filename                   */
            document.getElementById(name).id = "dragtarget";            /* set element ID to 'dragtarget'         */
            var drag = document.getElementById("dragtarget");           /* set drag to element being hovered over */
            drag.addEventListener("dragstart", function(event) {        /* add event listener to drag element     */
                console.log("event: " + event);
                event.dataTransfer.setData("Text", event.target.id);
                console.log("event.target.id: " + event.target.id);
            });
        }

        tableRow.onmouseout = function () {
            name = value.toString().slice(3, -1);
            console.log(name);
            document.getElementById("dragtarget").id = name;
        }

        tableRow.id = value.toString().slice(3, -1);
        //tableRow.id = "dragtarget"
        tableRow.draggable = "true";

        document.getElementById("fileTable").appendChild(tableRow);

    });
}

function clearList() {
	var x = document.getElementById("fileTable").rows.length;
	for (i = 0; i < x; i++) {
		document.getElementById("fileTable").deleteRow(0);
    }
    // console.log(templateFiles.length);
	templateFiles = [];
}
