// Attempt at re-write of FX Tool in Electron.js
// Date: Jan 2019

    var net = require('net');
    var graphics_files = new Array ;
    var client = new net.Socket();


    function sendCmd(cmd) {
        clearList();
        client.connect(9102, '10.10.154.97', function () {
            //console.log('connected');
            client.write(cmd);
            });
        
    }


// Send R4 command to request template file list
    function getList() {
        sendCmd('R4$VIDEO:');
    }

// Handle receiving template file list
    function receiveFileList(data) {
        //console.log('Received: ' + data);
        if (data != 'R51end:') {
            graphics_files.push(data);
            client.write('R5$VIDEO:');
        } else if(data == 'R51end:') {
            //console.log("destroying");
            client.destroy();
            graphics_files.forEach(function (value) {
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
    }

//  oxTel response dispatcher
    function onData(data) {
        var oxCode = data.toString().substring(0,3);
        //console.log(oxCode);
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


    client.on('data', onData);


    client.on('closed', function () {
        console.log('Connection closed');
    
    });

    function clearList() {
        var x = document.getElementById("fileTable").rows.length;
        for (i = 0; i < x; i++) {
            document.getElementById("fileTable").deleteRow(0);   
        }
        graphics_files = [];
    }

    function getFileId() {
        console.log(document.getElementById("fileTable").innerHTML);
    }
