const { execSync } = require("child_process");

class EVMChainDeployer {
    constructor() {
        this.contracts = {};
    }

    async deployCrossChain(chainInfo) {
        console.log('deployCrossChain1')
        execSync("cd contracts/dante-cross-chain/avalanche && echo " + chainInfo.sk + " > .secret", (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });

          console.log('deployCrossChain2');
        let cmd = "cd contracts/dante-cross-chain/avalanche && npm install && npx truffle migrate --network CHAIN" + chainInfo.id;
        execSync(cmd, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
          console.log('deployCrossChain3')
    }

    async deployMainStarport(chainInfo) {
        console.log('deployMainStarport')
        execSync("cd contracts/star-trek/contracts && echo " + chainInfo.sk + " > .secret", (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });

          console.log('deployMainStarport 2');
        let cmd = "cd contracts/star-trek/contracts && npm install && npx truffle migrate --from 2 --network CHAIN" + chainInfo.id;
        execSync(cmd, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
          console.log('deployMainStarport 3')
    }

    async deployStarport(chainInfo) {
        console.log('deployMainStarport')
        execSync("cd contracts/star-trek/contracts && echo " + chainInfo.sk + " > .secret", (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });

          console.log('deployMainStarport 2');
        let cmd = "cd contracts/star-trek/contracts && npm install && npx truffle migrate --from 3 --network CHAIN" + chainInfo.id;
        execSync(cmd, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
          });
          console.log('deployMainStarport 3')      
    }
}

module.exports = new EVMChainDeployer();