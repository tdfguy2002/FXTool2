
let blessed = require('blessed');
const Graphics = require('./graphics.js');

let screen;

let layers;
let templates;
let previousSelectedTemplate = 1;
let fileList;

let visibilities;
let previousSelectedVisibility = 1;
let keyerEffect = undefined;

let status;

let _fileManager;
let _graphics;

function logprops(obj) {
    for (var prop in obj) {
      screen.log("prop: " + prop + " val: " + obj[prop]);
    }
}

exports.initialize = function(fileManager, graphics) {

    _fileManager = fileManager;
    _graphics = graphics;

    graphics.addListener(Graphics.TEMPLATE_LOADED, (e) => { 
        status.setContent("Template loaded: layer: " + e.layer + " filename: " + e.filename);
        initTemplates();        
        screen.render();      
    });

    graphics.addListener(Graphics.TEMPLATE_UNLOADED, (e) => {
        status.setContent("Template unloaded: layer: " + e.layer);
        initTemplates();  
        screen.render();      
    });    

    graphics.addListener(Graphics.KEYER_POSITION_CHANGED, (e) => {     
        status.setContent("Keyer position changed: layer: " + e.layer + " position: " + _graphics.positionToString(e.position));
        initVisibilities();
        screen.render();      
    })

    screen = blessed.screen({
        smartCSR: true,
        log: "out.log",
        debug: true
    });

    screen.title = 'Oxtel CLI';

    fileList = blessed.list({
        top: '0',
        left: '50%',
        width: '50%',
        height: '100%',
        tags: true,
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'blue',
          border: {
            fg: '#f0f0f0'
          },
          hover: {
            bg: 'green'
          },
          cell: {
            fg: 'red',
            bg: 'yellow'
          }
        },
        keys: true,
        vi: true
    });

    layers = blessed.list({
        top: '0',
        left: '0',
        width: '10%',
        height: '80%',
        tags: true,
        align: 'center',
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'blue',
          border: {
            fg: '#f0f0f0'
          },
          hover: {
            bg: 'green'
          },
        },
        keys: false,
        vi: false,
        interactive: false
    }); 

    templates = blessed.list({
        top: '0',
        left: '10%',
        width: '75%',
        height: '80%',
        tags: true,
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'blue',
          border: {
            fg: '#f0f0f0'
          },
          hover: {
            bg: 'green'
          },
          header: {
            bg: 'black',
            fg: 'red'
          }
        },
        keys: true,
        vi: true
    }); 

    visibilities = blessed.list({
        top: '0',
        left: '85%',
        width: '15%',
        height: '80%',
        tags: true,
        align: 'center',
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'blue',
          border: {
            fg: '#f0f0f0'
          },
          hover: {
            bg: 'green'
          },
          header: {
            bg: 'black',
            fg: 'red'
          }
        },
        keys: true,
        vi: true
    });    
    
    keyerEffect = blessed.list({
        top: '0',
        left: '70%',
        width: '15%',
        height: '100%',
        tags: true,
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'blue',
          border: {
            fg: '#f0f0f0'
          },
          hover: {
            bg: 'green'
          },
          cell: {
            fg: 'red',
            bg: 'yellow'
          }
        },
        keys: true,
        vi: true
    });    

    status = blessed.box({
        top: '700',
        left: 'center',
        width: '100%',
        height: '20%',
        content: 'Oxtel CLI (JavaScript and Blessed)',
        tags: true,
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'black',
          border: {
            fg: '#f0f0f0'
          },
          hover: {
            bg: 'green'
          }
        },
        interactive: false
      });

    templates.key(['up', 'down'], function(ch, key) {
        if ((key.name == "up") && (previousSelectedTemplate == 1)) {
            templates.select(8);
        }
        else if (key.name == "down" && (previousSelectedTemplate == 8)) {
            templates.select(1);
        }
        previousSelectedTemplate = templates.selected;
        screen.render();
    });

    templates.key('enter', function(ch, key) {
        if (fileList.hidden) {
            initFileList();
            fileList.show();
            fileList.focus();
        }
        screen.render();
    });

    fileList.on('select', function(data) {  
        let layer = Graphics.MAX_LAYERS - templates.selected;
        switch(data.content) {
            case "-- Cancel --":
                status.setContent("Action cancelled");
                break;
            case "-- Unload --":
                status.setContent("Unload: layer: " + layer);
                _graphics.unload(layer);
                break;
            default:
                status.setContent("Load: layer: " + layer + " template: " + data.content);
                _graphics.load(layer, data.content);
                break;
        }    
        fileList.hide();
        templates.focus();
        screen.render();
    });    

    visibilities.key(['up', 'down'], function(ch, key) {
        if ((key.name == "up") && (previousSelectedVisibility == 1)) {
            visibilities.select(8);
        }
        else if (key.name == "down" && (previousSelectedVisibility == 8)) {
            visibilities.select(1);
        }
        previousSelectedVisibility = visibilities.selected;
        screen.render();
    });

    visibilities.key('enter', function(ch, key) {
        if (keyerEffect.hidden) {
            initKeyerEffect();
            keyerEffect.show();
            keyerEffect.focus();
        }
        screen.render();
    });    

    keyerEffect.on('select', function(data) {  
        let layer = Graphics.MAX_LAYERS - visibilities.selected;
        switch(data.content) {
            case "-- Cancel --":
                status.setContent("Action cancelled");
                break;
            case "Cut up":
                _graphics.cut(layer, 1);
                break;
            case "Fade up 30":
                _graphics.fade(layer, 1, 30);
                break;
            case "Fade up 60":
                _graphics.fade(layer, 1, 60);
                break;
            case "Fade up 90":
                _graphics.fade(layer, 1, 90);
                break;
            case "Cut down":
                _graphics.cut(layer, 0);
                break;
            case "Fade down 30":
                _graphics.fade(layer, 0, 30);
                break;
            case "Fade down 60":
                _graphics.fade(layer, 0, 60);
                break;
            case "Fade down 90":
                _graphics.fade(layer, 0, 90);
                break;
            default:
                break;
        }    
        if (data.content != "-- Cancel --") {
            status.setContent(data.content);
        }
        keyerEffect.hide();
        visibilities.focus();
        screen.render();
    });      

    screen.key(['tab'], function(ch, key) {
        if (templates.focused) {
            visibilities.focus();
        }
        else {
            templates.focus();
        }
    });

    templates.on('select', function(data) {
        status.setContent("templates selected");
    })

    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        return process.exit(0);
    });
    
    screen.append(layers);
    screen.append(templates);
    screen.append(visibilities);
    screen.append(status);
    
    screen.append(fileList);
    screen.append(keyerEffect);

    fileList.hide();
    keyerEffect.hide();

    templates.focus();

    initLayers();

    previousSelectedTemplate = 1;
    initTemplates();
    templates.select(1);

    previousSelectedVisibility = 1;
    initVisibilities();
    visibilities.select(1);

    screen.render();
}

function initLayers() {
    layers.clearItems();
    layers.add("{center}{yellow-bg}{black-fg} Layer {/}");
    for (let i = Graphics.MAX_LAYERS; i > 0; i--) {
        layers.add(i.toString());
    }
}

function initTemplates() {
    templates.clearItems();
    templates.add("{center}{yellow-bg}{black-fg}    Template    {/}");
    for (let i = Graphics.MAX_LAYERS - 1; i >= 0; i--) {
        templates.add(_graphics.getLoadedTemplate(i));
    }   
    templates.select(previousSelectedTemplate); 
}

function initVisibilities() {
    visibilities.clearItems();
    visibilities.add("{center}{yellow-bg}{black-fg} Visibility {/}");
    for (let i = Graphics.MAX_LAYERS - 1; i >= 0; i--) {
        let val = _graphics.getKeyerPosition(i);
        let text = "";
        switch (val) {
            case 0: text = "Hidden"; break;
            case 1: text = "Visible"; break;
            case 2: text = "Partial"; break;
        }
        visibilities.add(text);
    } 
    visibilities.select(previousSelectedVisibility);
}

function initFileList() {
    fileList.clearItems();
    fileList.setItems(_fileManager.getFileList());
    fileList.insertItem(0, "-- Unload --");
    fileList.insertItem(0, "-- Cancel --");
    fileList.select(0);
}

function initKeyerEffect() {
    keyerEffect.clearItems();
    keyerEffect.setItems(["-- Cancel --", 
                          "Cut up",
                          "Fade up 30",
                          "Fade up 60", 
                          "Fade up 90",
                          "Cut down",
                          "Fade down 30",
                          "Fade down 60", 
                          "Fade down 90",                          
                        ]);
    keyerEffect.select(0);
}

