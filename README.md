# Star trek system test

Scripts for executing system test

## Prerequisites

- node >= v18
- git

## Usage

### Clone this repository
```
git clone --recursive git@github.com:dantenetwork/star-trek-system-test.git
```

### Install
```
npm install
```

### Change config
The fields in the [configuration file](./config/default.json) can be changed to fullfil test demands.

- crossChainContractPath: The path of the cross chain contracts
- starportContractPath: The path of the starport contracts
- starportToolPath: The path of the starport command line tool
- routerPath: The path of the router
- networks: Indicates on which chains the test should be run
    - chainType: only `EVM` currently
    - mainStarport: indicates if the chain is the main chain
    - secretKey: The secret key which is used to deploy contracts


### Test
```
node index.js
```