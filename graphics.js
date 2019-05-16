const EventEmitter = require('events');
const GraphicsLayer = require('./graphics-layer.js');
const Oxtel = require('./oxtel.js');

class Graphics extends EventEmitter {

    constructor() {
        super();
        this._oxtel = undefined;        

        this._isReady = false;
        this._loadTalliesReceived = 0;
        this._preloadedTalliesReceived = 0;
        this._keyerPositionTalliesReceived = 0;

        this._onImageLoadTallyListener = this._onImageLoadTally.bind(this);
        this._onImagePreloadTallyListener = this._onImagePreloadTally.bind(this);
        this._onKeyerPositionTallyListener =  this._onKeyerPositionTally.bind(this);

        this._layers = new Array();
        for (let i = 0; i < Graphics.MAX_LAYERS; i++) {
            this._layers.push(new GraphicsLayer(i));
        }
    }

    initialize(oxtel) {
        this._oxtel = oxtel;

        this._isReady = false;
        this._loadTalliesReceived = 0;
        this._preloadedTalliesReceived = 0;
        this._keyerPositionTalliesReceived = 0;

        this._layers = new Array();
        for (let i = 0; i < Graphics.MAX_LAYERS; i++) {
            this._layers.push(new GraphicsLayer(i));
        }        

        this._oxtel.addListener(Oxtel.IMAGE_LOAD_TALLY, this._onImageLoadTallyListener);   
        this._oxtel.addListener(Oxtel.IMAGE_PRELOAD_TALLY, this._onImagePreloadTallyListener);                
        this._oxtel.addListener(Oxtel.KEYER_POSITION_TALLY, this._onKeyerPositionTallyListener);                

        this._oxtel.enableImageLoadTally(true);
    }

    shutdown() {
        this._oxtel.removeListener(Oxtel.IMAGE_LOAD_TALLY, this._onImageLoadTallyListener);   
        this._oxtel.removeListener(Oxtel.IMAGE_PRELOAD_TALLY, this._onImagePreloadTallyListener);                
        this._oxtel.removeListener(Oxtel.KEYER_POSITION_TALLY, this._onKeyerPositionTallyListener);                
    }

    //--------------------------------------------------------------------------
    // Templates
    //--------------------------------------------------------------------------

    //
    // Load
    //
    load(layer, filename) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        this._oxtel.load(layer, filename);
    }

    getLoadedTemplate(layer) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        return this._layers[layer].loadedTemplate;
    }

    isLayerLoaded(layer) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        return this._layers[layer].isLoaded();
    }

    //
    // Preload
    //
    preload(layer, filename) {
        this._oxtel.preload(layer, filename);
    }

    getPreloadedTemplate(layer) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        return this._layers[layer].preloadedTemplate;
    }

    isLayerPreloaded(layer) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        return this._layers[layer].isPreloaded();
    }

    unload(layer) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        this._oxtel.unload(layer);
    }

    //
    // Keyer
    //
    fade(layer, direction, rate) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        if (!this.isDirectionValid(direction)) {
            return false;
        }

        if (!this.isRateValid(rate)) {
            return false;
        }

        this._oxtel.fade(layer, direction, rate);

        return true;
    }

    cut(layer, direction) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        if (!this.isDirectionValid(direction)) {
            return false;
        }

        this._oxtel.cut(layer, direction);

        return true;
    }

    setFaderAngle(layer, angle) {
        if (!this.isLayerValid(layer)) {
            return false;
        }    

        if (!this.isAngleValid(angle)) {
            return false;
        }

        this._oxtel.setFaderAngle(layer, angle);

        return true;
    }

    getKeyerPosition(layer) {
        if (!this.isLayerValid(layer)) {
            return false;
        } 

        return this._layers[layer].keyerPosition;    
    }

    //
    // Valid Methods
    //
    isLayerValid(layer) {
        if ((layer < 0) || (layer > Graphics.MAX_LAYERS - 1)) {
            return false;
        }

        return true;
    }

    isDirectionValid(direction) {
        if ((direction < 0) || (direction > Graphics.MAX_DIRECTION - 1)) {
            return false;
        }

        return true;
    }

    isRateValid(rate) {
        if ((rate < 0) || (rate > Graphics.MAX_RATE)) {
            return false;
        }

        return true;
    }

    isAngleValid(angle) {
        if ((angle < 0) || (angle > Graphics.MAX_ANGLE)) {
            return false;
        }

        return true;
    }

    //
    // Utility Methods
    //
    print() {
        for (let i = 0; i < Graphics.MAX_LAYERS; i++) {
            let layer = this._layers[i];
            console.log("layer: " + i + " loaded: " + layer.loadedTemplate + " preloaded: " + layer.preloadedTemplate + " keyer: " + this.positionToString(layer.keyerPosition));
        }

        console.table(this._layers);
    }

    positionToString(val) {
        switch (val) {
            case 0: return "down";
            case 1: return "up";
            case 2: return "middle";
            default: return "unknown";
        }
    }

    //
    // Tally handlers
    //
    _onImageLoadTally(obj) {
        // console.log("Image Load Tally: layer: " + obj.layer + " filename: " + obj.filename);        

        let filename = "";
        if (obj.filename != ">Empty<") {
            filename = obj.filename;
        }

        this._layers[obj.layer].loadedTemplate = filename;

        if (this._isReady) {
            if (filename === "") {
                let detail = {
                    layer: obj.layer
                }
                this.emit(Graphics.TEMPLATE_UNLOADED, detail);
            }
            else {
                let detail = {
                    layer: obj.layer,
                    filename: obj.filename
                };
                this.emit(Graphics.TEMPLATE_LOADED, detail);
            }
        }
        else {
            this._loadTalliesReceived++;
            this._checkReady();
        }
    }

    _onImagePreloadTally(obj) {
        console.log("Image Preload Tally");
        let filename = "";
        if (obj.filename != ">Empty<") {
            filename = obj.filename;
        }

        this._layers[obj.layer].preloadedTemplate = filename;

        if (this._isReady) {
            let detail = {
                layer: obj.layer,
                filename: obj.filename
            };
            this.emit(Graphics.TEMPLATE_PRELOADED, detail);
        }
        else {
            this._preloadTalliesReceived++;
            this._checkReady();
        }
    }    

    _onKeyerPositionTally(obj) {
        // console.log("Keyer Position Tally: layer: " + obj.layer + " position: " + obj.position);

        this._layers[obj.layer].keyerPosition = obj.position;

        if (this._isReady) {
            let detail = {
                layer: obj.layer,
                position: obj.position
            };
            this.emit(Graphics.KEYER_POSITION_CHANGED, detail);
        }
        else {
            this._keyerPositionTalliesReceived++;
            this._checkReady();
        }
    }

    _checkReady() {
        if (!this._isReady) {
            if ((this._loadTalliesReceived == Graphics.MAX_LAYERS) &&
                (this._keyerPositionTalliesReceived == Graphics.MAX_LAYERS)) {
                this._isReady = true;
                this.emit(Graphics.READY);
            }
        }
    }
}

Graphics.READY = "Graphics.READY";
Graphics.TEMPLATE_LOADED = "Graphics.TEMPLATE_LOADED";
Graphics.TEMPLATE_PRELOADED = "Graphics.TEMPLATE_PRELOADED";
Graphics.TEMPLATE_UNLOADED = "Graphics.TEMPLATE_UNLOADED";
Graphics.KEYER_POSITION_CHANGED = "Graphics.KEYER_POSITION_CHANGED";

Graphics.MAX_LAYERS = 8;

Graphics.DIRECTION_DOWNN = 0;
Graphics.DIRECTION_UP = 1;
Graphics.DIRECTION_TOGGLE = 2;
Graphics.MAX_DIRECTION = 3;

Graphics.MAX_RATE = 999;

Graphics.MAX_ANGLE = 512;

module.exports = Graphics;