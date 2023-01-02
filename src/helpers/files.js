import fs from "fs";
import crypto from "crypto";
import path from 'path';
import {sayCurrFolder} from "./say.js";
import InvalidArgumentError from "../Errors/InvalidArgumentError.js";

const listContents = async (listFolder) => {
    fs.access(listFolder, (err ) => {
        if(err) throw new InvalidArgumentError('Operation failed');
    });

    const files = await getDirectoryContents(listFolder)

    if(files.length === 0) {
        console.log('Directory is empty');
    } else {
        console.log(files)
        console.table(files, ["Name", "Type"]);
    }
    sayCurrFolder();

};

const getDirectoryContents = async path => (await fs.promises.readdir(path, { withFileTypes: true }))
    .sort((itemA,itemB) => {return itemA.isDirectory() && !itemB.isDirectory() ? -1 : 1})
    .map(item => new FolderItem(item.name, item.isDirectory()))

function FolderItem(name, isDir) {
    this.Name = name;
    this.Type = isDir ? 'directory' : 'file';
}

const readFile = (filePath) => {
    const readableStream = fs.createReadStream(filePath, 'utf-8');

    readableStream.on('error', function (error) {
        throw new Error(`Operation failed: ${error.message}`);
    })

    readableStream.on('data', (chunk) => {
        console.log(chunk);
    })
}

const checkFilePath = (inputPath) => {
    inputPath = prepareInputPath(inputPath);
    return fs.existsSync(inputPath) && fs.lstatSync(inputPath).isFile();
};

const checkDirPath = (inputPath) => {
    inputPath = prepareInputPath(inputPath);
    return fs.existsSync(inputPath) && fs.lstatSync(inputPath).isDirectory();
}

const prepareInputPath = (inputPath) => {
    if(inputPath === '.') {
        return process.cwd();
    }

    if((!inputPath.startsWith('/') && inputPath.indexOf(':\\') === -1) ||
        inputPath.startsWith('./')) {
        inputPath = path.join(process.cwd(), inputPath);
    }

    return inputPath.replace(/['"]+/g, '');
}

const calculateHash = (inputPath) => {
    fs.promises.readFile(inputPath, 'utf-8')
    .then((res) => {
        const hashSum = crypto.createHash('sha256')
        hashSum.update(res)
        return hashSum.digest('hex')
    })
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.error(err.message)
    })
};

const readFileByStream = (filePath) => {

    const fileReadStream = fs.createReadStream(filePath, 'utf8');
    fileReadStream.on('error', function (error) {
        throw new Error(`Operation failed: ${error.message}`);
    });

    console.log('======= START Contents of ' + filePath + ' =======');
    fileReadStream.on('data', (chunk) => {
        console.log(chunk);
    });

    fileReadStream.on('end', () => {
        console.log('======= END Contents of ' + filePath + ' =======');
        sayCurrFolder();
    });
}
const copyFileByStream = (filePathFrom, destinationFolderPath) => {
    const filePathTo = path.join(destinationFolderPath, path.basename(filePathFrom)),
        readableStream = fs.createReadStream(filePathFrom, {encoding: 'utf8'}),
        writableStream = fs.createWriteStream(filePathTo)

    readableStream.on('end', () => {
        sayCurrFolder();
    });

    readableStream.pipe(writableStream)
}

const moveFileByStream = (filePathFrom, destinationFolderPath) => {
    const filePathTo = path.join(destinationFolderPath, path.basename(filePathFrom))
    const readableStream = fs.createReadStream(filePathFrom, 'utf8');
    const writableStream = fs.createWriteStream(filePathTo);

    readableStream.on('end', () => {
        fs.unlink(filePathFrom, (err) => {
            if (err) {
                throw new Error(`Operation failed: ${error.message}`);
            }
            sayCurrFolder();
        });

    });

    readableStream.pipe(writableStream)
}

const createFile = async (filePath) => {
    fs.stat(filePath, (err, stats) => {
        if (!stats) {
            fs.writeFile(filePath, '', () => {
                sayCurrFolder();
            });
        } else {
            throw new Error(`Operation failed: ${error.message}`);
        }
    });
};

const fileRename = async (filePath, newFileName) => {
    fs.rename(
        filePath,
        path.join(path.dirname(filePath), newFileName),
        (err) => {
            if (err) {
                throw new Error('Operation failed: ' + err.message);
            }
        }
    );
};

const fileRemove = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw new Error('Operation failed: Removing initial file failed. ' + err.message);
        }
    });
};

export {
    listContents,
    readFile,
    calculateHash,
    checkFilePath,
    checkDirPath,
    prepareInputPath,
    readFileByStream,
    copyFileByStream,
    moveFileByStream,
    createFile,
    fileRename,
    fileRemove,

};