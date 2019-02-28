


var net = require('net');
//var client = new net.Socket();
const EventEmitter = require('events');



class Oxtel extends EventEmitter {

    constructor() {
        super();
        this._ipAddress = "";
        this._port = "";
        this._isConnected = false;
        this.client = undefined;
    }

    //--------------------------------------------------------------------------
    // Socket Methods
    //--------------------------------------------------------------------------

    connect(port, ipAddress) {
        this._ipAddress = ipAddress;
        this._port = port;
        this.client = new net.Socket();

    //--------------------------------------------------------------------------
    // Add connect listeners
    //--------------------------------------------------------------------------
        this.client.on('data', this._onSocketDataReceived.bind(this));
        this.client.on('ready', this._onConnectReady);
        this.client.on('error', this._onConnectError);
        this.client.on('connect', this._onConnect);
        this.client.on('close', this._onConnectClose);

        // create socket
        console.log("port: " + this._port);
        this.client.connect(this._port, this._ipAddress);


        console.log(oxtel.readyState);
        // add handlers
    }

    disconnect() {
        // remove handlers

        // destroy socket

        this._isConnected = false;
    }

    isConnected() {
        return this._isConnected;
    }


    _onConnectReady(data) { 
        console.log("connection ready..."); 
    }

    _onConnectError(data) {
        console.log("error when connecting...");
    }
    
    _onConnect(data) {
        console.log("connect success...");
    }
    
    _onConnectClose(data) {
        console.log("connection closed...");
    }


    //--------------------------------------------------------------------------
    // Socket data received handler
    //--------------------------------------------------------------------------
    _onSocketDataReceived(data) {
    
      // console.log(data);
      //  Split data into individual received response strings.
      //  Example:  R40a.swf:....:....: should be 3 separate response strings.

      //  Foreach response string received perform the following:

      //  Parse data on socket and create an object that contains key/value pairs for all parameters
        let obj = this._parseResponseStr(data.toString());
        console.log("this is the returned object: " + obj);
        let eventName = undefined;
        switch (obj) {
            case "R4":
                console.log("do I get here?");
                oxtel.querySubsequentFile();
                // eventName = Oxtel.QUERY_FIRST_FILE_RESPONSE;
                break;
            case "R5":
                console.log("is R5 command: " + obj);
                oxtel.querySubsequentFile();
                // eventName = Oxtel.QUERY_SUBSEQUENT_FILE;
                break;
            default:
                break;
        }

        if (eventName) {
            this.emit(eventName, obj);            
        }
    }

    //--------------------------------------------------------------------------
    // Parse individual response strings
    //--------------------------------------------------------------------------
    _parseResponseStr(str) {
        if (str.startsWith("R4")) {
            let obj = {
                command: str.substr(0, 2),
                endReached: (str.substr(2, 1) == "1") ? true : false,
                filename: str.substr(3)  
            };
            console.log(obj);
            return obj;
        }
        else if (str.startsWith("R5")) {
            
        }
    }

    //--------------------------------------------------------------------------
    // Commands to send to the socket
    //--------------------------------------------------------------------------
    queryFirstFile() {
        this.client.write('R4$VIDEO:');
        console.log("after R4$VIDEO");
        // Send 'R4$VIDEO' to the socket
    }

    querySubsequentFile() {
        console.log("am I getting here?");
        this.client.write('R5$VIDEO:');
        console.log("after R4$VIDEO");
        // Send 'R5$VIDEO' to the socket
    }
}

// Connection events
Oxtel.CONNECTED = "Oxtel.CONNECTED";
Oxtel.DISCONNECTED = "Oxtel.DISCONNECTED";

// Response events
Oxtel.QUERY_FIRST_FILE_RESPONSE = "Oxtel.QUERY_FIRST_FILE";
Oxtel.QUERY_SUBSEQUENT_FILE_RESPONSE = "Oxtel.QUERY_SUBSEQUENT_FILE";

let oxtel = new Oxtel();
oxtel.connect(9102, '10.10.154.97');
oxtel.queryFirstFile();
