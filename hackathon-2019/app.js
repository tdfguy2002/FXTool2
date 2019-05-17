
var program = require('commander');

const Oxtel = require('./oxtel.js');
const FileManager = require('./file-manager.js');
const Graphics = require('./graphics.js');

const uiBlessed = require('./ui-blessed.js');
const uiCommandLine = require('./ui-commandline.js');


let oxtel = new Oxtel();
let fileManager = new FileManager();
let graphics = new Graphics();

oxtel.addListener(Oxtel.CONNECTED, () => {
    console.log("Connected");
    fileManager.initialize(oxtel);

});

oxtel.addListener(Oxtel.DISCONNECTED, () => {
    console.log("Disconnected");
    graphics.shutdown();
    fileManager.shutdown();
});

fileManager.addListener(FileManager.READY, () => {
    console.log("filemanager ready");
    graphics.initialize(oxtel);    
});

graphics.addListener(Graphics.READY, () => {
    console.log("graphics ready");
    initUI();
});

function initUI() {
    if (program.cli) {
        uiCommandLine.initialize(fileManager, graphics);    
    }
    else if (program.blessed) {
        uiBlessed.initialize(fileManager, graphics);
    }
    else {
        uiCommandLine.initialize(fileManager, graphics);    
    }
}

program
    .version('0.1.0')
    .option('-c, --cli', 'CLI interface')
    .option('-b, --blessed', 'Blessed interface')
    .parse(process.argv);

oxtel.connect("10.10.55.67", 9100);

