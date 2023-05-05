const config = require('config');
const nodes = require('./nodes/index');
const contracts = require('./contracts/index');
const fs = require('fs');

function generateConfig() {
    let ret = [];
    let networks = config.get('networks');
    let index = 1;
    for (let i = 0; i < networks.length; ++i) {
        if (networks[i].count) {
            for (let j = 0; j < networks[i].count; j++) {
                ret.push({
                    id: index++,
                    chainType: networks[i].chainType,
                    sk: networks[i].secretKey,
                    mainStarport: networks[i].mainStarport
                });
            }
        }
        else {
            ret.push({
                id: index++,
                chainType: networks[i].chainType,
                sk: networks[i].secretKey,
                mainStarport: networks[i].mainStarport
            });
        }
    }
    return ret;
}

function replaceTruffleConfig(networks) {
    console.log('replaceTruffleConfig')
    let str = '';
    // let netConfig = 'CHAIN_NAME:{\nprovider:()=>new HDWalletProvider(mnemonic,`CHAIN_RPC`),\nnetwork_id: "*",},\n';
    let netConfig = 'CHAIN_NAME:{\nhost:`CHAIN_HOST`,\nport:`CHAIN_PORT`,\nnetwork_id: "*",},\n';
    for (let i = 0; i < networks.length; i++) {
        if (networks[i].chainType == 'EVM') {
            let port = nodes.getNodePort(networks[i].id);
            // str += netConfig.replace('CHAIN_NAME', 'CHAIN' + networks[i].id).replace('CHAIN_RPC', 'http://127.0.0.1:' + port);
            str += netConfig.replace('CHAIN_NAME', 'CHAIN' + networks[i].id).
            replace('CHAIN_HOST', '127.0.0.1').
            replace('CHAIN_PORT', port);
        }
    }
    console.log('replaceTruffleConfig2', str);
    let truffleConfigStr = fs.readFileSync('./res/config/truffle-config.js').toString();
    truffleConfigStr = truffleConfigStr.replace('NETWORK_TEMPLATE', str);
    fs.writeFileSync('./contracts/dante-cross-chain/avalanche/truffle-config.js', truffleConfigStr);
    fs.writeFileSync('./contracts/star-trek/contracts/truffle-config.js', truffleConfigStr);
}

async function main() {
    // Generate config
    let networks = generateConfig();
    // Launch nodes
    console.log('networks0')
    await nodes.launch(networks);
    // Update truffle config
    replaceTruffleConfig(networks);
    // Deploy contracts
    console.log('networks1')
    await contracts.deploy(networks);
    // Run test cases
}

main();