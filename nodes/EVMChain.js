const { exec } = require("child_process");

module.exports = {
    launch: function(id) {
        let port = id + 8545;
        exec("ganache --server.ws -p " + port);
        return port;
    },
}