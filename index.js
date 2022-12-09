import {getArgValue} from "./src/helpers/args.js";
import * as readline from "readline";
import {__resolveAction} from "./src/controller.js";
import {sayHi, sayBye, sayCurrFolder} from "./src/helpers/say.js";
import {homedir} from "os";

const usernameRaw = getArgValue('username');
const username = (!usernameRaw || !usernameRaw.length) ? 'Guest' : usernameRaw.charAt(0).toUpperCase() + usernameRaw.slice(1);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

process.chdir(homedir());
process.on('uncaughtException', (err) => {
    console.log(err.message);
});
sayHi(username);

rl.on('line', (line) => {
    const inputLine = line.trim();
    const actionEnd = line.indexOf(' ') !== -1 ? line.indexOf(' ') : 0;
    const action = actionEnd ? inputLine.slice(0, actionEnd) : inputLine;
    const actionsSayingFolderInside = ['ls', 'compress', 'decompress', 'cat', 'add', 'rn', 'cp', 'mv'];

    const params = inputLine.indexOf(' ') === -1 ? [] : `${inputLine}`
        .slice(inputLine.indexOf(' '), inputLine.length)
        .trim().match(/(?:[^\s"]+|"[^"]*")+/g);

    __resolveAction(action, params).then(() => {
        if(!actionsSayingFolderInside.includes(action)) {
            sayCurrFolder();
        }
    })
});

rl.on('close', () => sayBye(username));