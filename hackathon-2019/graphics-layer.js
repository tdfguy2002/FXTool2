class GraphicsLayer {

    constructor(layer) {
        this._layer = layer;
        this._loadedTemplate = "";
        this._preloadedTemplate = ""; 
        this._keyerPosition = 0;
    }

    get layer() {
        return this._layer;
    }

    get loadedTemplate() {
        return this._loadedTemplate;
    }

    set loadedTemplate(val) {
        this._loadedTemplate = val;
    }

    isLoaded() {
        return !this._isEmpty(this._loadedTemplate);
    }

    get preloadedTemplate() {
        return this._preloadedTemplate;
    }

    set preloadedTemplate(val) {
        this._preloadedTemplate = val;
    }

    isPreloaded() {
        return !this._isEmpty(this._preloadedTemplate);
    }

    _isEmpty(str) {
        if (!str || 0 === str.length) {
            return true;
        }

        return false;
    }

    get keyerPosition() {
        return this._keyerPosition;
    }

    set keyerPosition(val) {
        this._keyerPosition = val;
    }
}

module.exports = GraphicsLayer;