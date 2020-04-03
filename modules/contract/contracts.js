const confFile = __dirname + '/../../config.json';
const jsonfile = require('jsonfile');
var eztz = {};
var config = jsonfile.readFileSync(confFile);
const ConseilJS = '../../lib/conseiljs';
const TESTNET_NAME = 'carthagenet';

const Logger = require('../logger');
const { Helper } = require('../helper');

class Contracts {

    async listContracts() {
        Logger.verbose('Command : tezster list-contracts');
        if(Object.keys(config.contracts).length > 0) {        
            for(var i in config.contracts) { 
                Logger.info(Helper.output(config.contracts[i].label + ' - ' + config.contracts[i].pkh + ' (' + config.contracts[i].identity + ')'));        
            }
        } else {
            Logger.info(Helper.outputError('No Contracts are Available !!'));
        }
    }

    async deployContract(args) {
        Logger.verbose(`Command : tezster deploy ${args}`);
        if (args.length < 4) {
            Logger.info(Helper.outputInfo('Incorrect usage of deploy command \nCorrect usage: - tezster deploy <contract-label> <contract-absolute-path> <init-storage-value> <account> [options]'));
            return;
        }
        await this.loadTezsterConfig(); 
    
        let result = await this.deploy(args[0], args[1], args[2], args[3], args[5]);
        var parseError = result.indexOf('Instead, ');
        Logger.info(result.substring(0, parseError != -1  ? parseError : result.length));
        Logger.info(Helper.outputInfo(`If you're using ${TESTNET_NAME} node, use https://${TESTNET_NAME}.tzstats.com to check contract/transactions`));
    }

    async callContract(args) {
        Logger.verbose(`Command : tezster call ${args}`);
        if (args.length < 3) {
            Logger.info(Helper.outputInfo('Incorrect usage of call command \nCorrect usage: - tezster call <contract-name> <argument-value> <account>'));
            return;
        }
        
        let result = await this.invokeContract(args[0], args[1], args[2]);
        Logger.info(result);
        Logger.info(Helper.outputInfo(`If you're using ${TESTNET_NAME} node, use https://${TESTNET_NAME}.tzstats.com to check contract/transactions`));
    }

    async getStorage(args) {
        Logger.verbose(`Command : tezster get-storage ${args}`);
        if (args.length < 1) {
            Logger.info(Helper.outputInfo('Incorrect usage of get-storage command \nCorrect usage: - tezster get-storage <contract-name>'));
            return;
        }
        
        let result = await this.getContractStorage(args[0]);
        Logger.info(result);
    }

    async addContract(args) {
        Logger.verbose(`Command : tezster add-contract ${args}`);
        if (args.length < 2) {
            return Logger.info(Helper.outputError('Incorrect usage - tezster add-contract <label> <Address>'));
        }
        Logger.info(this.addContractToConfig(args[0], args[1], ''));      
    }

    async getEntryPoints(args) {
        Logger.verbose(`Command : tezster extract-entry-points ${args}`);
        if (args.length < 1) {
            return Logger.info(Helper.outputError('Incorrect usage - tezster list-entry-points <contract-absolute-path>'));
        }
        this.extractEntryPoints(args[0]);
    }

    async extractEntryPoints(contractPath) {
        const fs = require('fs');
        const conseiljs = require(ConseilJS);
        try {
            const contractCode = fs.readFileSync(contractPath, 'utf8');
            const entryPoints = await conseiljs.TezosContractIntrospector.generateEntryPointsFromCode(contractCode);
            const storageFormat = await conseiljs.TezosLanguageUtil.preProcessMichelsonScript(contractCode);
            Logger.info(`Initial Storage input must be of type : ${storageFormat[1].slice(8)}`);
            entryPoints.forEach(p => {
                Logger.info(`\nName => ${p.name}\nParameters => (${p.parameters.map(pp => (pp.name || '') + pp.type).join(', ')})\nStructure => ${p.structure}\n`);
            });
        }
        catch(error) {
            return Helper.outputError(error);
        }
    }

    async deploy(contractLabel, contractPath, initValue, account, amount) {
        const fs = require('fs');
        const conseiljs = require(ConseilJS);
        const tezosNode = config.provider;  

        const keys = this.getKeys(account);
        if(!keys) {
            return Helper.outputError(`Couldn't find keys for given account.\nPlease make sure the account exists and added to tezster. Run 'tezster list-accounts' to get all accounts`);
        }
        const keystore = {
            publicKey: keys.pk,
            privateKey: keys.sk,
            publicKeyHash: keys.pkh,
            seed: '',
            storeType: conseiljs.StoreType.Fundraiser
        };
      
        let contractObj = Helper.findKeyObj(config.contracts, contractLabel);
        if (contractObj) {
            return Helper.outputError(`This contract label is already in use. Please use a different one.`);
        }

        if(amount == undefined) {
            amount = 0;
        } else {
            amount = amount;
        }
      
        try {
            const contract = fs.readFileSync(contractPath, 'utf8');
            const result = await conseiljs.TezosNodeWriter.sendContractOriginationOperation(
                                      tezosNode, keystore, amount, undefined,
                                      100000, '', 10000, 100000, 
                                      contract, initValue, conseiljs.TezosParameterFormat.Michelson);         
            if (result.results) {
                switch(result.results.contents[0].metadata.operation_result.status) {
                    case 'applied':
                        let opHash = result.operationGroupID.slice(1,result.operationGroupID.length-2);
                        opHash = eztz.contract.hash(opHash);
                        this.addNewContract(contractLabel, opHash , keys.pkh);
                        return Helper.output(`contract '${contractLabel}' has been deployed at ${opHash}`);
          
                    case 'failed':
                    default:
                        return Helper.outputError(`Contract deployment has failed : ${JSON.stringify(result.results.contents[0].metadata.operation_result)}`)
              }
            }
            return Helper.outputError(`Contract deployment has failed : ${JSON.stringify(result)}`);
        } catch(error) {
            return Helper.outputError(error);
        }
    }

    async invokeContract(contract, argument, account) {
        const conseiljs = require(ConseilJS);
        const tezosNode = config.provider;
        const keys = this.getKeys(account);
        if(!keys) {
            return Helper.outputError(`Couldn't find keys for given account.\nPlease make sure the account exists and added to tezster. Run 'tezster list-accounts' to get all accounts`);
        }
        const keystore = {
            publicKey: keys.pk,
            privateKey: keys.sk,
            publicKeyHash: keys.pkh,
            seed: '',
            storeType: conseiljs.StoreType.Fundraiser
        };
      
        let contractAddress = '';
        let contractObj = Helper.findKeyObj(config.contracts, contract);
        if (contractObj) {
          contractAddress = contractObj.pkh;
        }
        
        if (!contractAddress) {
          return Helper.outputError(`couldn't find the contract, please make sure contract label or address is correct!`);
        }
      
        try {
          const result = await conseiljs.TezosNodeWriter.sendContractInvocationOperation(
                                      tezosNode, keystore, contractAddress, 0, 100000, '', 1000, 100000, undefined, 
                                      argument, conseiljs.TezosParameterFormat.Michelson);
          
          if (result.results) {
            switch(result.results.contents[0].metadata.operation_result.status) {
              case 'applied':
                  let opHash = result.operationGroupID.slice(1,result.operationGroupID.length-2);
                  this.addTransaction('contract-call', opHash, keys.pkh, contractObj.label, 0);
                  return Helper.output(`Injected operation with hash ${opHash}`);
      
              case 'failed':
              default:
                  return Helper.outputError(`Contract calling has failed : ${JSON.stringify(result.results.contents[0].metadata.operation_result)}`)
            }
          }
          return Helper.outputError(`Contract calling has failed : ${JSON.stringify(result)}`);
        }
        catch(error) {
            return Helper.outputError(error);
        }
    }

    async getContractStorage(contract) {
        const conseiljs = require(ConseilJS);
        const tezosNode = config.provider;
        let contractAddress = '';
        let contractObj = Helper.findKeyObj(config.contracts, contract);
        if (contractObj) {
            contractAddress = contractObj.pkh;
        }
      
        if (!contractAddress) {
            return Helper.outputError(`couldn't find the contract, please make sure contract label or address is correct!`);
        }
      
        try {
            let storage = await conseiljs.TezosNodeReader.getContractStorage(tezosNode, contractAddress);
            return Helper.output(JSON.stringify(storage));
        }
        catch(error) {
            return Helper.outputError(error);
        }
    }

    addContractToConfig(contractLabel, contractAddr) {
        let contractObj = Helper.findKeyObj(config.contracts, contractLabel);
        if (contractObj) {
            return Helper.outputError('This contract label is already in use. Please use a different one.');
        }
        this.addNewContract(contractLabel, contractAddr, '');
    }

    addNewContract(label, opHash, pkh) {
        config.contracts.push({
            label : label,
            pkh : opHash,
            identity : pkh,
        });
        jsonfile.writeFile(confFile, config);
    }

    addTransaction(operation, opHash, from, to, amount) {
        config.transactions.push({
            operation : operation,
            hash : opHash,
            from : from,
            to: to,
            amount: amount
        });
        jsonfile.writeFile(confFile, config);
    }

    getKeys(account) {
        let keys,f;
        if (f = Helper.findKeyObj(config.identities, account)) {
            keys = f;
        } else if (f = Helper.findKeyObj(config.accounts, account)) {
            keys = Helper.findKeyObj(config.identities, f.identity);
        } else if (f = Helper.findKeyObj(config.contracts, account)) {
            keys = Helper.findKeyObj(config.identities, f.identity);
        }
        return keys;
    }

    async loadTezsterConfig() {
        eztz = require('../../lib/eztz.cli.js').eztz;
        const jsonfile = require('jsonfile');
        config=jsonfile.readFileSync(confFile);
        if (config.provider) {
            eztz.node.setProvider(config.provider);
        }  
        const _sodium = require('libsodium-wrappers');
        await _sodium.ready;
        eztz.library.sodium = _sodium;
    }

}

module.exports = { Contracts }
