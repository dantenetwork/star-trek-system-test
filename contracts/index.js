const nodesMgr = require('../nodes/index');
const EVMChain = require('../contracts/EVMChain');

module.exports = class {
    constructor() {

    }

    async deploy(networks) {
        for (let i = 0; i < networks.length; i++) {
            if (networks.chainType == 'EVM') {
                await EVMChain.deployCrossChain(networks[i].id);
            }
        }
    }
}