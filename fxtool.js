// FX Tool in Electron.js
// Date: Jan 2019



function displayTemplateFiles() {
		templateFiles.forEach(function (value) {
			var x = value.toString().lastIndexOf('.');
			var tableRow = document.createElement("tr");
			var fileName = document.createTextNode(value.toString().slice(3, -1));

			tableRow.appendChild(fileName);

			tableRow.onmouseover = function () {
				name = value.toString().slice(3, -1);
				console.log(name);
				//debugger;
				document.getElementById(name).id = "dragtarget";
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
	templateFiles = [];
}
