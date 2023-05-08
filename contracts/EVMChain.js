const { execSync } = require("child_process");
const config = require('config');

class EVMChainDeployer {
    constructor() {
        this.contracts = {};
    }

    async deployCrossChain(chainInfo) {
        console.log('deployCrossChain', chainInfo);
        execSync("cd " + config.get('crossChainContractPath') + " && echo -n " + chainInfo.sk + " > .secret");

        let cmd = "cd " + config.get('crossChainContractPath') + " && npm install && npx truffle migrate --network CHAIN" + chainInfo.id;
        execSync(cmd);
    }

    async deployMainStarport(chainInfo) {
        console.log('deployMainStarport', chainInfo);
        execSync("cd " + config.get('starportContractPath') + " && echo -n " + chainInfo.sk + " > .secret");

        let cmd = "cd " + config.get('starportContractPath') + " && npm install && npx truffle migrate --f 2 --to 2 --network CHAIN" + chainInfo.id;
        execSync(cmd);
    }

    async deployStarport(chainInfo) {
        console.log('deployStarport', chainInfo);
        // to be continued, there can be different accounts in .secret
        execSync("cd " + config.get('starportContractPath') + " && echo -n " + chainInfo.sk + " > .secret");

        let cmd = "cd " + config.get('starportContractPath') + " && npm install && npx truffle migrate --f 3 --to 3 --network CHAIN" + chainInfo.id;
        execSync(cmd);   
    }
}

module.exports = new EVMChainDeployer();