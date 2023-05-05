const nodesMgr = require('../nodes/index');
const EVMChain = require('./EVMChain');

class ContractsMgr {
    constructor() {

    }

    async deploy(networks) {
        console.log('networks', networks);
        for (let i = 0; i < networks.length; i++) {
            if (networks[i].chainType == 'EVM') {
                // await EVMChain.deployCrossChain(networks[i]);
                if (networks[i].mainStarport) {
                    await EVMChain.deployMainStarport(networks[i]);
                }
                else {
                    await EVMChain.deployStarport(networks[i]);
                }
            }
        }
    }
}

module.exports = new ContractsMgr();