import InvalidActionError from "./Errors/InvalidActionError.js";
import path from "path";
import {
    calculateHash,
    checkDirPath,
    checkFilePath, copyFileByStream, createFile, fileRemove, fileRename,
    listContents, moveFileByStream,
    prepareInputPath,
    readFileByStream
} from "./helpers/files.js";
import {getFirstKey, getFirstPathArg, getSecondPathArg} from "./helpers/args.js";
import InvalidArgumentError from "./Errors/InvalidArgumentError.js";
import {EOL, homedir, userInfo} from "os";
import {printCpusInfo} from "./helpers/os_info.js";
import {compressBrotli, decompressBrotli} from "./helpers/compression.js";
import {sayCurrFolder} from "./helpers/say.js";

export const __resolveAction = async (action, params) => {
    switch (action) {
        case 'up':
            actionUp();
            break;
        case 'cd':
            actionCd(params);
            break;
        case 'ls':
            actionLs();
            break;
        case 'cat':
            actionCat(params);
            break;
        case 'add':
            actionAdd(params);
            break;
        case 'rn':
            actionRename(params);
            break;
        case 'cp':
            actionCp(params);
            break;
        case 'mv':
            actionMv(params);
            break;
        case 'rm':
            actionRemove(params);
            break;
        case 'os':
            actionOs(params);
            break;
        case 'hash':
            actionHash(params);
            break;
        case 'compress':
            await actionCompress(params);
            break;
        case 'decompress':
            await actionDecompress(params);
            break;
        default:
            throw new InvalidActionError('Invalid input');
    }
};

const actionUp = () => {
    process.chdir('..');
};

const actionCd = (params) => {
    if(params.length !== 1) {
        throw new InvalidArgumentError('Wrong arguments for cd');
    }
    var dir = prepareInputPath(getFirstPathArg(params));

    if(!dir.startsWith('/') && dir.indexOf(':') === -1)
    {
        dir = process.cwd() + path.sep + dir;
    }
    process.chdir(dir);
};

const actionLs = () => {
    listContents(process.cwd());
};

const actionCat = (params) => {
    let filePath = prepareInputPath(getFirstPathArg(params));
    if(!checkFilePath(getFirstPathArg(params))) {
        throw new InvalidArgumentError('Invalid input. File is not exist in ' + filePath);
    }
    console.log('======= Contents of ' + filePath + ' =======');
    readFileByStream(filePath);
};

const actionAdd = (params) => {
    let filePath = prepareInputPath(getFirstPathArg(params));
    createFile(filePath);
};

const actionRename = (params) => {
    let filePath = prepareInputPath(getFirstPathArg(params));
    if(!checkFilePath(getFirstPathArg(params))) {
        throw new InvalidArgumentError('Invalid input. File is not exist in ' + filePath);
    }

    fileRename(filePath, getSecondPathArg(params)).then(() => {
        sayCurrFolder();
    });
};

const actionCp = (params) => {
    if(!checkFilePath(getFirstPathArg(params)) || !checkDirPath(getSecondPathArg(params))) {
        throw new InvalidArgumentError('Invalid input. first should be existing file and second is folder.');
    }

    copyFileByStream(
        prepareInputPath(getFirstPathArg(params)),
        prepareInputPath(getSecondPathArg(params))
    );
};

const actionMv = (params) => {
    let filePath = prepareInputPath(getFirstPathArg(params));
    if(!checkFilePath(getFirstPathArg(params)) || !checkDirPath(getSecondPathArg(params))) {
        throw new InvalidArgumentError('Invalid input. first should be existing file and second is folder.');
    }

    moveFileByStream(
        filePath,
        prepareInputPath(getSecondPathArg(params))
    );
};

const actionRemove = (params) => {
    let filePath = prepareInputPath(getFirstPathArg(params));
    if(!checkFilePath(getFirstPathArg(params))) {
        throw new InvalidArgumentError('Invalid input. Check file path.');
    }

    fileRemove(filePath);
};



const actionOs = (params) => {
    let key = getFirstKey(params);
    switch(key) {
        case 'EOL':
            console.log('Current system End-Of-Line is ' + JSON.stringify(EOL));
            break;
        case 'cpus':
            printCpusInfo();
            break;
        case 'homedir':
            console.log('Home dir is ' + homedir());
            break;
        case 'username':
            console.log('OS username is "' + userInfo().username + '"');
            break;
        case 'architecture':
            console.log('CPU architecture is ' +  process.arch);
            break;
        default:
            throw new InvalidArgumentError('Key ' + key + ' not found');
    }
};

const actionHash = (params) => {
    if(!checkFilePath(getFirstPathArg(params))) {
        throw new InvalidArgumentError('Invalid input.');
    }
    console.log('File hash is: ' + calculateHash(getFirstPathArg(params)));
};

const actionCompress = async (params) => {
    if(!checkFilePath(getFirstPathArg(params)) || !checkDirPath(getSecondPathArg(params))) {
        console.log('Check that first argument is file and second is directory that exists');
        return;
    }

    await compressBrotli(prepareInputPath(getFirstPathArg(params)), prepareInputPath(getSecondPathArg(params)));
};

const actionDecompress = async (params) => {
    if(!checkFilePath(getFirstPathArg(params)) || !checkDirPath(getSecondPathArg(params))) {
        throw new Error('Invalid input. Check that first argument is file and second is directory that exists');
    }

    await decompressBrotli(prepareInputPath(getFirstPathArg(params)), prepareInputPath(getSecondPathArg(params)));
};