import InvalidArgumentError from "../Errors/InvalidArgumentError.js";

const getArgValue = (argKey) => {
    const args = process.argv.slice(2);

    var value = null
    args.map((item, index) => {
        if(item.startsWith('--')){
            item.slice(2);
            if(item.slice(2).indexOf(argKey) === 0) {
                value = args[index].slice(3+argKey.length);
            }
        }
    });

    return value;
};

const getFirstKey = (params) => {
    if(!params.length) {
        throw new InvalidArgumentError('Invalid input');
    }

    const args = params;
    let key = params[0];

    args.map((item, index) => {
        if(item.startsWith('--')){
            let endOfKey = (item.indexOf(' ') !== -1 ? item.indexOf(' ') : (
                item.indexOf('=') !== -1 ? item.indexOf('=') : item.length
            ));
            key = item.slice(2, endOfKey)
        }
    });

    return key;
};

const getFirstPathArg = (params) => {
    if(!params.length) {
        throw new InvalidArgumentError('Invalid input');
    }
    return `${params[0].trim()}`;
};

const getSecondPathArg = (params) => {
    if(params.length <= 1) {
        throw new InvalidArgumentError('Second path is not set');
    }

    return params[1].trim();
};

export {
    getArgValue,
    getFirstKey,
    getFirstPathArg,
    getSecondPathArg,
}