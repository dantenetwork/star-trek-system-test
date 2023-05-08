const { execSync } = require("child_process");
const config = require('config');
const utils = require('../utils');
const Web3 = require('web3');
const fs = require('fs');
const nodes = require('../nodes/index');

function initialize(networks) {
    console.log('initialize');
    let cmd;
    // Cross chain contracts
    for (let i = 0; i < networks.length; i++) {
        cmd = 'cd ' + config.get('crossChainContractPath') + ' && node register/index.js -i CHAIN' + networks[i].id;
        execSync(cmd);
    }

    // Starport contracts
    cmd = 'cd ' + config.get('starportToolPath') + ' && npm install';
    execSync(cmd);
    for (let i = 0; i < networks.length; i++) {
        cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -i CHAIN' + networks[i].id;
        execSync(cmd);
        for (let j = 0; j < networks.length; j++) {
            if (i != j) {
                let cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -r CHAIN' + networks[i].id + ',CHAIN' + networks[j].id;
                execSync(cmd);
            }
        }
    }

    // Set starports
    console.log('starports');
    let starportCfg = JSON.parse(fs.readFileSync(config.get('starportContractPath') + 'config/default.json').toString());
    let starportsInfo = '';
    for (let i = 0; i < networks.length; i++) {
        let item = '"CHAIN' + networks[i].id + '|' + starportCfg['CHAIN' + networks[i].id].starport + '"';
        if (i == 0) {
            starportsInfo = item;
        }
        else {
            starportsInfo += ',' + item;
        }
    }
    console.log('starportsInfo', starportsInfo);
    cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -ss CHAIN' + networks[0].id + ',' + starportsInfo;
    execSync(cmd);
}

module.exports = {
    runTests: async function(networks) {
        console.log('runTests');
        // Initialize contracts
        initialize(networks);

        // Get diamonds
        // to be continued, the first starport is not always the main starport
        console.log('Get diamonds');
        let cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -d CHAIN1';
        execSync(cmd);
        
        // Create ship
        // to be continued, the address should not be written in the code
        console.log('Create ship');
        cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -c CHAIN1,0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA,1';
        execSync(cmd);

        // Settle and trek
        for (let i = 0; i < networks.length - 1; i++) {
            if (networks[i].chainType == 'EVM') {
                // to be continued, support other chains
                await utils.evmMine(5, new Web3.providers.HttpProvider('http://127.0.0.1:' + nodes.getNodePort(networks[i].id)));
            }
            // Settle
            console.log('Settle', i);
            cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -st CHAIN' + networks[i].id + ',0';
            execSync(cmd);
            console.log('Trek', i);
            // Trek
            cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -t CHAIN' + networks[i].id + ',0,0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA,CHAIN' + networks[i + 1].id;
            execSync(cmd);
            await utils.sleep(5);
        }

        // Settle
        console.log('Settle');
        await utils.evmMine(5, new Web3.providers.HttpProvider('http://127.0.0.1:' + nodes.getNodePort(networks[networks.length - 1].id)));
        cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -st CHAIN' + networks[networks.length - 1].id + ',0';
        execSync(cmd);

        // Back to main
        console.log('Back');
        cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -t CHAIN' + networks[networks.length - 1].id + ',0,0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA,CHAIN' + networks[0].id;
        execSync(cmd);
        await utils.sleep(10);

        // Synthesize diamonds
        console.log('Synthesize');
        cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -s CHAIN' + networks[0].id + ',0,5';
        execSync(cmd);

        // Check diamonds
        console.log('Check');
        cmd = 'cd ' + config.get('starportToolPath') + ' && node index.js -b CHAIN' + networks[0].id + ',0xe092b1fa25DF5786D151246E492Eed3d15EA4dAA';
        let ret = execSync(cmd);
        console.log('ret', ret.toString());
    }
}