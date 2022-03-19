require("@nomiclabs/hardhat-waffle");
let secret = require("./secret")


module.exports = {
  networks: {
    hardhat: {
        chainId: 1337
    },
    ropsten: {
        url: secret.url,
        accounts: [secret.key]
    },
  },
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/backend/artifacts",
    sources: "./src/backend/contracts",
    cache: "./src/backend/cache",
    tests: "./src/backend/test"
  },
};
