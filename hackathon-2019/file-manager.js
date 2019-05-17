const EventEmitter = require('events');
const Oxtel = require('./oxtel.js');

class FileManager extends EventEmitter {

    constructor() {
        super();
        this._oxtel = undefined;
        this._fileList = new Array();

        this._onQueryFileResponseListener = this._onQueryFileResponse.bind(this);
        this._onMediaTallyListener = this._onMediaTally.bind(this);
    }

    initialize(oxtel) {
        this._oxtel = oxtel;
        this._oxtel.addListener(Oxtel.QUERY_FIRST_FILE_RESPONSE, this._onQueryFileResponseListener);
        this._oxtel.addListener(Oxtel.QUERY_SUBSEQUENT_FILE_RESPONSE, this._onQueryFileResponseListener);

        this._oxtel.addListener(Oxtel.MEDIA_TALLY, this._onMediaTallyListener);
        this._oxtel.enableMediaTallies(true);

        this._oxtel.queryFirstFile();
    }

    shutdown() {
        // empty out the this._fileList
        this._fileList = new Array();

        this._oxtel.removeListener(Oxtel.QUERY_FIRST_FILE_RESPONSE, this._onQueryFileResponseListener);
        this._oxtel.removeListener(Oxtel.QUERY_SUBSEQUENT_FILE_RESPONSE, this._onQueryFileResponseListener);

        this._oxtel.removeListener(Oxtel.MEDIA_TALLY, this._onMediaTallyListener);
    }

    getFile(index) {
        return this._fileList[index];
    }

    getFileList() {
        return this._fileList;
    }    

    isValidFile(filename) {
        let len = this._fileList.length;
        for (let i = 0; i < len; i++) {
            if (this._fileList[i] == filename) {
                return true;
            }
        }        
        return false;
    }

    _onQueryFileResponse(obj) {
        if (!obj.endReached) {
            this._fileList.push(obj.filename);
            this._oxtel.querySubsequentFile();
        }
        else {
            this.emit(FileManager.READY);
        }
    }

    _onMediaTally(obj) {
        console.log("media tally received: action: " + Oxtel.mediaTallyActionToStr(obj.action) + " filename: " + obj.filename);
        switch (obj.action) {
            case Oxtel.MEDIA_ACTION_ADDED:
                this._fileAdded(obj.filename);
                break;
            case Oxtel.MEDIA_ACTION_DELETED:
                this._fileDeleted(obj.filename);
                break;
            case Oxtel.MEDIA_ACTION_MODIFIED:
                this._fileModified(obj.filename);
                break;
            default:
                break;
        }
    }

    _fileAdded(filename) {
        this._fileList.push(filename);  
        this._fileList.sort();  
        this._emitEvent(FileManager.FILE_ADDED, filename);         
    }

    _fileDeleted(filename) {
        let len = this._fileList.length;
        for (let i = 0; i < len; i++) {
            if (this._fileList[i] == filename) {
                this._fileList.splice(i, 0);
                this._emitEvent(FileManager.FILE_DELETED, filename);         
                break;
            }
        }
    }

    _fileModified(filename) {
        this._emitEvent(FileManager.FILE_MODIFIED, filename);         
    }

    _emitEvent(event, filename) {
        let detail = {
            filename: filename
        }
        this.emit(event, detail);
    }

    print() {
        console.table(this._fileList);
    }


}

FileManager.READY = "FileManager.READY";
FileManager.FILE_ADDED = "FileManager.FILE_ADDED";
FileManager.FILE_MODIFIED = "FileManager.FILE_MODIFIED";
FileManager.FILE_DELETED = "FileManager.FILE_DELETED";

module.exports = FileManager;