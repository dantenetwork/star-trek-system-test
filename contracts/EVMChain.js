const { exec } = require("child_process");

class EVMChainDeployer {
    constructor() {
        this.contracts = {};
    }

    async deployCrossChain(id) {
        exec("truffle migrate --from 2 --network ", id);
    }

    async deployMainStarport(chainInfo) {
        exec("truffle migrate --from 3 --network ", chainInfo.name);
    }

    async deployStarport(chainInfo) {
        exec("truffle migrate --from 3 --network ", chainInfo.name);        
    }
}