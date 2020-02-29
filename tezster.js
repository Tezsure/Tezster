#!/usr/bin/env node
'use strict';

const {setup} = require('./modules/Setup/setup.js');
const {startNodes} = require('./modules/Start-Nodes/start-nodes.js');
const {stopNodes} = require('./modules/Stop-Nodes/stop-nodes.js');
const {__getBalance} = require('./modules/Get-Balance/get-balance.js');
const {__getProvider} = require('./modules/Get-Provider/get-provider.js');
const {__setProvider} = require('./modules/Set-Provider/set-provider.js');
const {__deployContract} = require('./modules/Deploy/deploy.js');
const {__callContract} = require('./modules/Call/call.js');
const {__listContracts} = require('./modules/List-Contracts/list-contracts.js');
const {__transfer} = require('./modules/Transfer/transfer.js');
const {__listAccounts} = require('./modules/List-Accounts/list-accounts.js');
const {getStorage} = require('./modules/Get-Storage/get-storage.js');
const {addContract} = require('./modules/Add-Contract/add-contract.js');
const {__listTransactions} = require('./modules/List-Transactions/list-transactions.js');
const {__createAccount} = require('./modules/Create-Account/create-account.js');
const {addTestnetAccount} = require('./modules/Add-Testnet-Account/add-testnet-account.js');
const {activateTestnetAccount} = require('./modules/Activate-Testnet-Account/activate-testnet-account.js');

const program = require("commander");
const tezsterManager = require("./tezster-manager");

program
.version('0.1.9', '-v, --version')
.command('setup')
.description('To set up Tezos nodes')
.action(function(){
    setup();
});

program.command('start-nodes')
.description('Starts Tezos nodes')
.action(function() {
    startNodes();
});

program.command('stop-nodes')
.description('Stops Tezos nodes')
.action(function() {
    stopNodes();
});

//*******for check the balance check */
program
.command('get-balance')
.usage('<account/contract(pkh)>')
.description('To get the balance of account/contracts')
.action(function(){
    __getBalance();
});

//******* To get the list accounts */
program
.command('list-accounts')
.description('To fetch all the accounts')
.action(function(){    
    __listAccounts()
});

//******* TO get the list Contracts */
program
.command('list-contracts')
.description('To fetch all the contracts')
.action(function(){     
    __listContracts();
});

//******* To get the Provider */
program
.command('get-provider')
.description('To fetch the current provider')
.action(function(){        
    __getProvider();
});


//******* To set the Provider */
program
.command('set-provider')
.usage('[http://<ip>:<port>]')
.description('To change the default provider')
.action(function(){  
    __setProvider();
});

//******* To transfer the amount */
program
.command('transfer')
.usage('<amount> <from> <to>')
.description('To transfer the funds between accounts')
.action(function(){  
    __transfer();
});

//*******deploy contract written in Michelson*/
program
.command('deploy')
.usage('<contract-label> <contract-absolute-path> <init-storage-value> <account>')
.description('Deploys a smart contract written in Michelson')
.action(function(){
    __deployContract();
});

//*******calls contract written in Michelson*/
program
.command('call')
.usage('<contract-name/address> <argument-value> <account>')
.description('Calls a smart contract with given value provided in Michelson format')
.action(function(){
    __callContract();
});

//*******gets storage for a contract*/
program
.command('get-storage')
.usage('<contract-name/address>')
.description('Returns current storage for given smart contract')
.action(function(){
    getStorage();
});

/* Restores an testnet faucet account */
program
.command('add-testnet-account')
.usage('<account-label> <absolut-path-to-json-file>')
.description('Restores a testnet faucet account from json file')
.action(function(){
    addTestnetAccount();
});

/* Restores an testnet faucet account */
program
.command('activate-testnet-account')
.usage('<account-label>')
.description('Activates a testnet faucet account resored using tezster')
.action(function(){
    activateTestnetAccount();
});

/* list transactions done with tezster */
program
.command('list-transactions')
.description('List down all the transactions')
.action(function(){  
    __listTransactions();
});

//******* To Create an account */
program
.command('create-account')
.usage('<identity> <label> <amount>')
.description('To create a new account')
.action(async function(){  
    __createAccount(); 
});

//******* To Create an contract */
program
.command('add-contract')
.usage('<label> <address>')
.description('Adds a smart contract with label for interaction')
.action(async function(){  
    addContract();    
});

program
.on("--help", () => {
    console.log("\nTo know more about particular command usage:\n\ttezster [command] --help");
});

if (process.argv.length <= 2){
    console.log('\x1b[31m%s\x1b[0m', "Error: " +"Please enter a command!");
}
var commands=process.argv[2];
const validCommands = [  "list-Identities",
"list-accounts",
"list-contracts",
"get-balance",
"transfer",
"set-provider",
"get-provider",
"stop-nodes",
"start-nodes",
"setup",
"call",
"deploy",
"help",
"create-account",
"list-transactions",
"get-storage",
"add-testnet-account",
"activate-testnet-account",
"add-contract",
"-v",
"--version",
"--help",
"-h"];
if (validCommands.indexOf(commands) < 0 && process.argv.length >2 ) {
    const availableCommands = validCommands.filter(elem => elem.indexOf(commands) > -1);
    console.log('\x1b[31m%s\x1b[0m', "Error: " + "Invalid command\nPlease run 'tezster --help' to get info about commands ");    
    console.log("\nThe most similar commands are:");
    console.log("\t"+availableCommands.toString().replace(/,/g,"\n\t"));    
}

program.parse(process.argv);
