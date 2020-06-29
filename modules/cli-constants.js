const confFile = `/var/tmp/tezster/config.json`,
      CONSEIL_JS = '../../lib/conseiljs',
      TEMP_PATH = '/var/tmp',
      TEZSTER_FOLDER_PATH  = `/var/tmp/tezster`,
      TEZSTER_LOGS_FOLDER_PATH  = `/var/tmp/tezster/tezster-logs`,
      COMMAND_LOG_FILE = `/var/tmp/tezster/tezster-logs/tezster-command-logs.log`,
      LOGS_ZIPFILE_NAME = 'tezster-node-logs.tar.gz',
      LOGS_ZIPFILE_PATH = `/var/tmp/tezster/tezster-logs/tezster-node-logs.tar.gz`,
      LOG_FOLDER_PATH_INSIDE_DOCKER = `/usr/local/bin/tezster-logs`,
      CONFIG_FILE_ABSOLUTE_PATH_INSIDE_NPM_PACKAGE = require('path').join(__dirname, '/../config.json'),
      
      TESTNET_NAME = 'carthagenet',
      CONSEIL_SERVER_APIKEY = '04c98bd2-7cc5-49f2-9108-2d48efcbd660',
      CONSEIL_SERVER_URL = 'https://conseil-dev.cryptonomic-infra.tech',
      IMAGE_TAG = 'tezsureinc/tezster:1.0.3',
      CONTAINER_NAME = 'tezster',
      PROGRESS_REFRESH_INTERVAL = 1000,
      Node_Confirmation_Timeout = 40000,
      NODE_CONFIRMATION_TIMEOUT_WIN = 125000,
      Start_Nodes_Progress_Bar_Interval = 2.5,
      START_NODES_PROGRESS_BAR_INTERVAL_WIN = 0.80,
      LOCAL_NODE_URL = 'http://localhost:18731',
      WIN_OS_PLATFORM = 'win32',
      WIN_WSL_OS_RELEASE = 'microsoft',

      deployParameter = [
        {
          type : 'input',
          name : 'contractLabel',
          message : 'Enter contract label: '
        },
        {
          type : 'input',
          name : 'contractAbsolutePath',
          message : 'Enter absolute path of contract(.tz) file: '
        },
        {
          type : 'input',
          name : 'initStorageValue',
          message : 'Enter initial storage value: '
        },
        {
            type : 'input',
            name : 'account',
            message : 'Enter account label/pkh: '
        },
        {
            type : 'input',
            name : 'amount',
            message : 'Enter amount: (optional, default is 0) ',
            default: 0,
        },
        {
            type : 'input',
            name : 'fee',
            message : 'Enter operation fee: (optional, default is 100000)',
            default: 100000,
        },
        {
            type : 'input',
            name : 'storageLimit',
            message : 'Enter storage limit: (optional, default is 10000)',
            default: 10000,
        },
        {
            type : 'input',
            name : 'gasLimit',
            message : 'Enter gas limit: (optional, default is 500000)',
            default: 500000,
        },
    ],
    
    callParameter = [
        {
          type : 'input',
          name : 'contractName',
          message : 'Enter contract name: '
        },
        {
          type : 'input',
          name : 'argumentValue',
          message : 'Enter argument value: '
        },
        {
            type : 'input',
            name : 'account',
            message : 'Enter account label/pkh: '
        },
        {
            type : 'input',
            name : 'amount',
            message : 'Enter amount: (optional, default is 0) ',
            default: 0,
        },
        {
            type : 'input',
            name : 'fee',
            message : 'Enter operation fee: (optional, default is 100000)',
            default: 100000,
        },
        {
            type : 'input',
            name : 'storageLimit',
            message : 'Enter storage limit: (optional, default is 10000)',
            default: 10000,
        },
        {
            type : 'input',
            name : 'gasLimit',
            message : 'Enter gas limit: (optional, default is 500000)',
            default: 500000,
        },
    ];
      

module.exports = { confFile, CONSEIL_JS, TESTNET_NAME, CONSEIL_SERVER_APIKEY, TEZSTER_LOGS_FOLDER_PATH,
                   IMAGE_TAG, CONTAINER_NAME, LOCAL_NODE_URL, CONSEIL_SERVER_URL, COMMAND_LOG_FILE, TEMP_PATH,
                   PROGRESS_REFRESH_INTERVAL, TEZSTER_FOLDER_PATH, START_NODES_PROGRESS_BAR_INTERVAL_WIN,
                   LOGS_ZIPFILE_PATH, LOG_FOLDER_PATH_INSIDE_DOCKER, LOGS_ZIPFILE_NAME,
                   CONFIG_FILE_ABSOLUTE_PATH_INSIDE_NPM_PACKAGE, WIN_OS_PLATFORM, WIN_WSL_OS_RELEASE,
                   NODE_CONFIRMATION_TIMEOUT_WIN, Node_Confirmation_Timeout, Start_Nodes_Progress_Bar_Interval,
                   deployParameter, callParameter  };