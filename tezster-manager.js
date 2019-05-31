'use strict';
const cliColors = {
        red : '31m',
        yellow : '33m',
        cyan : '36m',
        white : '37m',
        green : '32m',
    },
    confFile = __dirname + '/config.json',
    jsonfile = require('jsonfile'); 

var eztz = {}, 
    config = jsonfile.readFileSync(confFile);

async function loadTezsterConfig() {
    eztz = require('./lib/eztz.cli.js').eztz;
    const jsonfile = require('jsonfile');
    config=jsonfile.readFileSync(confFile);
    if (config.provider) {
        eztz.node.setProvider(config.provider);
    }  
    const _sodium = require('libsodium-wrappers');
    await _sodium.ready;
    eztz.library.sodium = _sodium;
}

function formatTez(a){
    return formatMoney(a)+" ꜩ";
}

function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function getBalance(account) {
    var pkh = account, f;
    if (f = findKeyObj(config.identities, pkh)) {
    pkh = f.pkh;
    } else if (f = findKeyObj(config.accounts, pkh)) {
    pkh = f.pkh;
    } else if (f = findKeyObj(config.contracts, pkh)) {
    pkh = f.pkh;
    }
    return eztz.rpc.getBalance(pkh).then(function(r){
        return output(formatTez(r/100));
    }).catch(function(e){
        return outputError(e);
    });
}

function getProvider(){    
    if (config.provider){
        return outputInfo(config.provider);
    }else{
        return outputInfo("No provider is set");
    } 
}

function setProvider(args){    
    config.provider = args[0];
    jsonfile.writeFile(confFile, config);
    return outputInfo("Provider updated to " + config.provider);
}


function findKeyObj(list, t){
    for (var i = 0; i < list.length; i++){
      if (list[i].pkh == t || list[i].label == t) return list[i];
    }
    return false;
}

function outputError(e){
    return '\x1b['+cliColors.red+'Error :'+e+'\x1b[0m';
}

function outputInfo(e){
    return '\x1b['+cliColors.yellow+e+'\x1b[0m';
}

function output(e){
    return '\x1b['+cliColors.green+e+'\x1b[0m';
}

module.exports= {
    loadTezsterConfig: loadTezsterConfig,
    getBalance: getBalance,
    outputInfo: outputInfo,
    outputError: outputError,
    output:output,
    config: config,
    eztz: eztz,
    getProvider: getProvider,
    setProvider: setProvider
};
