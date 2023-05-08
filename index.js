const nodes = require('./nodes/index');
const contracts = require('./contracts/index');
const coordinator = require('./coordinator');
const tests = require('./tests/index');
const config = require('config');
const { exec } = require('child_process');

async function main() {
    // Generate config
    let networks = coordinator.generateConfig();

    // Launch nodes
    await nodes.launch(networks);

    // Update truffle config
    coordinator.onDeployContracts(networks);
    // Deploy contracts
    await contracts.deploy(networks);

    // Update router config
    coordinator.onLaunchRouter(networks);
    // Launch router
    exec('cd ' + config.get('routerPath') + ' && node src/main.js > out.log');    

    // Update test config
    coordinator.onTest(networks);
    // Run test cases
    await tests.runTests(networks);
}

main();