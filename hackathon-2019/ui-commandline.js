const readline = require('readline');
const Graphics = require('./graphics.js');

let _fileManager;
let _graphics;

exports.initialize = function(fileManager, graphics) {

    _fileManager = fileManager;
    _graphics = graphics;

    const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'EFFECTS> '
    });

    rl.prompt();

    rl.on('line', (line) => {
        if (line.length > 0) {
            let args = line.trim().split(" ");
            // console.log("line: " + line);
            // for (let i = 0; i < args.length; i++) {
            //     console.log("arg[" + i + "]:" + args[i]);
            // }
            switch (args[0]) {
                case "help":
                    console.log("Graphics commands");
                    console.log("--------------------------------------------------------");
                    console.log("load <layer> <template>");
                    console.log("preload <layer> <template>");
                    console.log("unload <layer>|all");
                    console.log("fade <layer> <direction> <rate>");
                    console.log("cut <layer> <direction>");
                    console.log(" ");
                    console.log("File Manager commands");
                    console.log("--------------------------------------------------------");
                    console.log("filelist");
                    console.log(" ");
                    console.log("Other commands");
                    console.log("--------------------------------------------------------");
                    console.log("help");
                    console.log("status");
                    console.log("quit or exit");
                    break;
                case "connect":
                    if (oxtel.isConnected()) {
                        oxtel.disconnect();
                    }

                    oxtel.connect(args[1], parseInt(args[2]));
                    break;
                case "disconnect":
                    if (oxtel.isConnected()) {
                        oxtel.disconnect();
                    }
                    break;
                case "graphics":
                    graphics[args[1]](parseInt(args[2]), args[3]);
                    break;
                case "load":
                    if (args.length == 3) {
                        let file = args[2];
                        if (!isNaN(args[2])) {
                            file = fileManager.getFile(parseInt(args[2]));
                        }
                        graphics.load(parseInt(args[1]), file);
                    }
                    break;
                case "preload":
                    if (args.length == 3) {
                        graphics.preload(parseInt(args[1]), args[2]);
                    }
                    break;
                case "unload":
                    if (args.length == 2) {
                        if (args[1] == "all") {
                            for (let i = 0; i < Graphics.MAX_LAYERS; i++) {
                                graphics.unload(i);
                            }
                        }
                        else {
                            graphics.unload(parseInt(args[1]));
                        }
                    }
                    break;
                case "fade":
                    if (args.length == 4) {
                        graphics.fade(parseInt(args[1]), parseInt(args[2]), parseInt(args[3]));
                    }
                    else if (args.length == 3) {
                        graphics.fade(parseInt(args[1]), parseInt(args[2]), 0);
                    }
                    break;
                case "cut":
                    if (args.length == 3) {
                        graphics.cut(parseInt(args[1]), parseInt(args[2]));
                    }
                    break;
                case "filelist":
                    fileManager.print();
                    break;
                case "status":
                    if (args.length == 1) {
                        graphics.print();
                    }
                    break;
                case "quit":
                case "exit":
                    process.exit(0);
                    break;
                default: 
                    console.log("I don't know that command: " + line);
            }
        }
        rl.prompt();
    }).on('close', () => {
    console.log('Have a great day!');
    process.exit(0);
    });
}
