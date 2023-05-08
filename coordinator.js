const config = require('config');
const fs = require('fs');
const { execSync } = require('child_process');
const nodes = require('./nodes/index');

function updateCrossChainConfig(networks) {
    console.log('updateCrossChainConfig');
    let cfg = {};
    for (let i = 0; i < networks.length; i++) {
        let item = {};
        if (networks[i].chainType == 'EVM') {
            let port = nodes.getNodePort(networks[i].id);
            item.nodeAddress = 'http://127.0.0.1:' + port;
            item.chainId = 1337;
            item.porters = ['0xc0d8F541Ab8B71F20c10261818F2F401e8194049'];
            item.request = 1;
        }
        cfg['CHAIN' + networks[i].id] = item;
    }
    fs.writeFileSync(config.get('crossChainContractPath') + 'config/default.json', JSON.stringify(cfg, null, '\t'));
}

function updateStarportConfig(networks) {
    console.log('updateStarportConfig');
    let cfg = {};
    for (let i = 0; i < networks.length; i++) {
        let item = {};
        if (networks[i].chainType == 'EVM') {
            let port = nodes.getNodePort(networks[i].id);
            item.nodeAddress = 'http://127.0.0.1:' + port;
            item.chainId = 1337;
            if (networks[i].mainStarport) {
                item.abi = './res/MainStarport.json';
            }
            else {
                item.abi = './res/Starport.json';
            }
        }
        item.interface = networks[i].chainType;
        cfg['CHAIN' + networks[i].id] = item;
    }
    fs.writeFileSync(config.get('starportContractPath') + 'config/default.json', JSON.stringify(cfg, null, '\t'));
}

function updateTruffleConfig(networks) {
    console.log('updateTruffleConfig');
    let str = '';
    let netConfig = 'CHAIN_NAME:{\nhost:`CHAIN_HOST`,\nport:`CHAIN_PORT`,\nnetwork_id: "*",},\n';
    for (let i = 0; i < networks.length; i++) {
        if (networks[i].chainType == 'EVM') {
            let port = nodes.getNodePort(networks[i].id);
            str += netConfig.replace('CHAIN_NAME', 'CHAIN' + networks[i].id).
            replace('CHAIN_HOST', '127.0.0.1').
            replace('CHAIN_PORT', port);
        }
    }
    console.log('truffle networks', str);
    let truffleConfigStr = fs.readFileSync('./res/config/truffle-config.js').toString();
    truffleConfigStr = truffleConfigStr.replace('NETWORK_TEMPLATE', str);
    fs.writeFileSync(config.get('crossChainContractPath') + 'truffle-config.js', truffleConfigStr);
    fs.writeFileSync(config.get('starportContractPath') + 'truffle-config.js', truffleConfigStr);
}

function updateToolConfig(networks) {
    console.log('updateToolConfig');
    let starportCfg = JSON.parse(fs.readFileSync(config.get('starportContractPath') + 'config/default.json').toString());
    let crossChainCfg = JSON.parse(fs.readFileSync(config.get('crossChainContractPath') + 'config/default.json').toString());
    let cfg = {};
    for (let i = 0; i < networks.length; i++) {
        let item = {};
        if (networks[i].chainType == 'EVM') {
            let port = nodes.getNodePort(networks[i].id);
            item.nodeAddress = 'http://127.0.0.1:' + port;
            item.chainId = 1337;
            if (networks[i].mainStarport) {
                item.abi = './res/MainStarport.json';
            }
            else {
                item.abi = './res/Starport.json';
            }
            item.starportContractAddress = starportCfg['CHAIN' + networks[i].id].starport;
            item.crossChainContractAddress = crossChainCfg['CHAIN' + networks[i].id].crossChainContractAddress;
        }
        item.interface = networks[i].chainType;
        cfg['CHAIN' + networks[i].id] = item;
    }
    fs.writeFileSync(config.get('starportToolPath') + 'config/default.json', JSON.stringify(cfg, null, '\t'));
}

function updateToolRes() {
    console.log('updateToolRes');
    execSync('cp ' + config.get('starportContractPath') + 'build/contracts/Starport.json ' + config.get('starportToolPath') + 'res/');
    execSync('cp ' + config.get('starportContractPath') + 'build/contracts/MainStarport.json ' + config.get('starportToolPath') + 'res/');
    execSync('cd ' + config.get('starportToolPath') + ' && echo -n ' + '0x0cc0c2de7e8c30525b4ca3b9e0b9703fb29569060d403261055481df7014f7fa' + ' > .secret');
}

function updateRouterConfig(networks) {
    console.log('updateRouterConfig');
    let crossChainCfg = JSON.parse(fs.readFileSync(config.get('crossChainContractPath') + 'config/default.json').toString());
    let cfg = {
        scanInterval: 2,
        logLevel: 'debug',
        secret: 'config/.secret',
        networks: {}
    };
    let allChains = [];
    for (let i = 0; i < networks.length; i++) {
        allChains.push('CHAIN' + networks[i].id);
    }

    console.log('allChains', allChains);
    for (let i = 0; i < networks.length; i++) {
        let item = {};
        if (networks[i].chainType == 'EVM') {
            let port = nodes.getNodePort(networks[i].id);
            item.nodeAddress = 'http://127.0.0.1:' + port;
            item.chainId = 1337;
            item.abiPath = './res/CrossChain.json';
            item.compatibleChain = 'ethereum';
            item.crossChainContractAddress = crossChainCfg['CHAIN' + networks[i].id].crossChainContractAddress;
            item.receiveChains = allChains;
        }
        cfg.networks['CHAIN' + networks[i].id] = item;
    }
    fs.writeFileSync(config.get('routerPath') + 'config/default.json', JSON.stringify(cfg, null, '\t'));
}

function updateRouterSecret(networks) {
    console.log('updateRouterSecret');
    let secretCfg = {};
    for (let i = 0; i < networks.length; i++) {
        secretCfg['CHAIN' + networks[i].id] = 'b97de1848f97378ee439b37e776ffe11a2fff415b2f93dc240b2d16e9c184ba9';
    }
    fs.writeFileSync(config.get('routerPath') + 'config/.secret', JSON.stringify(secretCfg, null, '\t'));
}

module.exports = {
    generateConfig: function() {
        console.log('generateConfig');
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
    },

    onDeployContracts: function(networks) {
        console.log('onDeployContracts');
        // Update cross chain config
        updateCrossChainConfig(networks);
        
        // Update starport config
        updateStarportConfig(networks);

        // Update truffle config
        updateTruffleConfig(networks);
    },

    onTest: function(networks) {
        console.log('onTest');
        updateToolConfig(networks);

        updateToolRes();
    },

    onLaunchRouter: function(networks) {
        updateRouterConfig(networks);

        updateRouterSecret();

        let cmd = 'cd ' + config.get('routerPath') + ' && npm install'
        execSync(cmd);
    }
}