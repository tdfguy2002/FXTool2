"use strict";

let net = require('net');
const EventEmitter = require('events');

class Oxtel extends EventEmitter {

    constructor() {
        super();

        this._isConnected = false;
        this._client = undefined;
    }

    //--------------------------------------------------------------------------
    // Socket Methods
    //--------------------------------------------------------------------------

    connect(ipAddress, port) {        
        // console.log("connect");

        // if (this._client) {
        //     this.disconnect();
        // }

        this._client = new net.Socket();        
        this._client.setKeepAlive(true, 2000);
        this._client.setNoDelay(true);

        this._client.on('data', this._onData.bind(this));
        this._client.on('ready', this._onReady.bind(this));
        this._client.on('error', this._onError.bind(this));
        this._client.on('connect', this._onConnect.bind(this));
        this._client.on('close', this._onClose.bind(this));

        this._client.connect(port, ipAddress);
    }

    disconnect() {
        if (!this._isConnected) {
            return;
        }

        this._client.destroy();
        
        this._isConnected = false;
    }

    isConnected() {
        return this._isConnected;
    }

    //--------------------------------------------------------------------------
    // Socket data received handler
    //--------------------------------------------------------------------------
    _onReady() {
        this._isConnected = true;
        this.emit(Oxtel.CONNECTED);
    }

    _onError(event) {
        console.log("_onError");
    }

    _onConnect(event) {
        console.log("_onConnect");
    }

    _onClose(event) {
        // console.log("_onDisconnect");
        this.emit(Oxtel.DISCONNECTED);
    }

    _onData(data) {
        // console.log("rx: " + data.toString());

        // Parse data on socket to and create an object that contains key/value pairs for all parameters
        let responses = data.toString().slice(0, data.length - 1).split(":");
        for (let i = 0; i < responses.length; i++) {
            let str = responses[i];
            let ret = this._handleResponseStr(str);

            if (!ret) {
                // console.error("str not handled: " + str);
            }
        }
    }

    //--------------------------------------------------------------------------
    // Parse individual response strings
    //--------------------------------------------------------------------------
    _handleResponseStr(str) {
        if (str.startsWith('3')) {
            let obj = {
                eventName: Oxtel.KEYER_POSITION_TALLY,
                command: str.substr(0, 1),
                layer: parseInt(str.substr(1, 1)),
                position: parseInt(str.substr(3, 1))
            };

            this.emit(obj.eventName, obj);
            return true;
        }
        else if (str.startsWith("R4")) {
            let obj = {
                eventName: Oxtel.QUERY_FIRST_FILE_RESPONSE,
                command: str.substr(0, 2),
                endReached: (str.substr(2, 1) == "1") ? true : false,
                filename: str.substr(3)
            };

            this.emit(obj.eventName, obj);

            return true;
        }
        else if (str.startsWith("R5")) {
            let obj = {
                eventName: Oxtel.QUERY_SUBSEQUENT_FILE_RESPONSE,
                command: str.substr(0, 2),
                endReached: (str.substr(2, 1) == "1") ? true : false,
                filename: str.substr(3).slice(0, str.length - 1)
            };

            this.emit(obj.eventName, obj);

            return true;
        }
        else if (str.startsWith("Y6")) {
            return true;
        }
        else if (str.startsWith("Y9")) {
            let obj = {
                eventName: Oxtel.IMAGE_LOAD_TALLY,
                command: str.substr(0, 2),
                layer: parseInt(str.substr(2,1)),
                filename: str.substr(3).slice(0, str.length - 1)
            };

            this.emit(obj.eventName, obj);
            return true;
        }
        else if (str.startsWith("YA")) {
            let obj = {
                eventName: Oxtel.IMAGE_PRELOAD_TALLY,
                command: str.substr(0, 2),
                layer: parseInt(str.substr(2,1)),
                filename: str.substr(3).slice(0, str.length - 1)
            };

            this.emit(obj.eventName, obj);
            return true;
        }        
        else if (str.startsWith("YB")) {
            let action;
            switch (str.substr(8, 1)) {
                case "0": action = Oxtel.MEDIA_ACTION_DELETED; break;
                case "1": action = Oxtel.MEDIA_ACTION_ADDED; break;
                case "2": action = Oxtel.MEDIA_ACTION_MODIFIED; break;
                default:
                    console.error("Invalid action:  " + str);
                    return false;
            }

            let obj = {
                eventName: Oxtel.MEDIA_TALLY,
                command: str.substr(0, 2),
                action: action,
                filename: str.substr(9)
            }

            this.emit(obj.eventName, obj);

            return true;
        }

        return false;
    }

    //--------------------------------------------------------------------------
    // Commands to send to the socket
    //--------------------------------------------------------------------------
    _send(str) {
        if (this._isConnected) {
            // console.log("tx: " + str + ":");
            this._client.write(str + ":");
        }
        else {
            console.error("not connected.  Can't send " + str);
        }
    }    

    //--------------------------------------------------------------------------
    // Templates
    //--------------------------------------------------------------------------

    // Load Image (R0)
    load(layer, filename) {
        this._send("R0" + layer.toString(16) + filename);
    }

    // Preload Image (R7)
    preload(layer, filename) {
        this._send("R7" + layer.toString(16) + filename);
    }

    // Erase Store (A) 
    unload(layer) {
        this._send("A" + layer.toString(16));
    }

    enableImageLoadTally(enable) {
        let val = (enable) ? "1" : "0";
        this._send("Y6" + val);
    }

    //--------------------------------------------------------------------------
    // Keyer
    //--------------------------------------------------------------------------
    fade(layer, direction, rate) {
        this._send("1" + layer.toString(16) + " " + direction.toString() + " " + rate.toString(16));
    }

    cut(layer, direction) {
        this._send("1" + layer.toString(16) + " " + direction.toString());
    }

    setFaderAngle(layer, angle) {
        this._send("@" + layer.toString(16) + " 1 " + angle.toString(16));
    }







    queryFirstFile() {
        this._send("R4$VIDEO");
    }

    querySubsequentFile() {
        this._send("R5$VIDEO");
    }

    enableMediaTallies(enable) {
        let val = (enable) ? "1" : "0";
        this._send("YB00000" + val);
    }

    static mediaTallyActionToStr(action) {
        switch (action) {
            case Oxtel.MEDIA_ACTION_DELETED:  return "deleted";
            case Oxtel.MEDIA_ACTION_ADDED:    return "added";
            case Oxtel.MEDIA_ACTION_MODIFIED: return "modified";
            default: return "unknown action";
        }
    }
}

// Connection events
Oxtel.CONNECTED = "Oxtel.CONNECTED";
Oxtel.DISCONNECTED = "Oxtel.DISCONNECTED";

// Response events
Oxtel.QUERY_FIRST_FILE_RESPONSE = "Oxtel.QUERY_FIRST_FILE";
Oxtel.QUERY_SUBSEQUENT_FILE_RESPONSE = "Oxtel.QUERY_SUBSEQUENT_FILE";

// Tally events
Oxtel.MEDIA_TALLY = "Oxtel.MEDIA_TALLY";

Oxtel.MEDIA_ACTION_DELETED = 0;
Oxtel.MEDIA_ACTION_ADDED = 1;
Oxtel.MEDIA_ACTION_MODIFIED = 2;

Oxtel.IMAGE_LOAD_TALLY = "Oxtel.IMAGE_LOAD_TALLY";
Oxtel.IMAGE_PRELOAD_TALLY = "Oxtel.IMAGE_PRELOAD_TALLY";
Oxtel.KEYER_POSITION_TALLY = "Oxtel.KEYER_POSITION_TALLY";

module.exports = Oxtel;