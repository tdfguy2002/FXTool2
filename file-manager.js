class FileManager {

    constructor() {
        this._fileList = new Array();
    }

    initialize() {
        document.addEventListener(Oxtel.QUERY_FIRST_FILE_RESPONSE, _onQueryFileResponse);
        document.addEventListener(Oxtel.QUERY_SUBSEQUENT_FILE_RESPONSE, _onQueryFileResponse);
        oxtel.queryFirstFile();
    }

    shutdown() {
        // empty out the this._fileList
    }

    _onQueryFileResponse(event) {
        if (!event.detail.endReached) {
            this._fileList.push(event.detail.filename);
            oxtel.querySubsequentFile();
        }
    }
}