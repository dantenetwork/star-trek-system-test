const config = require('config');
const nodes = require('./nodes/index');
const contracts = require('./contracts/index');

function generateConfig() {
    let ret = [];
    let networks = config.get('networks');
    let index = 1;
    for (let i = 0; i < networks.length; ++i) {
        if (networks[i].Count) {
            for (let j = 0; j < networks[i].Count; j++) {
                ret.push({
                    id: index++,
                    chainType: networks[i].chainType,
                });
            }
        }
        else {
            ret.push({
                id: index++,
                chainType: networks[i].chainType,
            });
        }
    }
    return ret;
}

async function main() {
    // Generate config
    let networks = generateConfig();
    // Launch nodes
    await nodes.launch(networks);
    // Deploy contracts
    // await contracts.deploy();
    // Run test cases
}

main();