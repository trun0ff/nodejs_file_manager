import {cpus} from "os";

const printCpusInfo = () => {
    const systemCpuCores = cpus();

    console.log('Total cpus in system: ' + systemCpuCores.length);

    let i = 0;
    systemCpuCores.forEach((cpu) => {
        console.log('CPU ' + ++i + ' | model: ' + cpu.model + ' | clock rate: ' + cpu.speed / 1000 + 'GHz');
    });
};

export {
    printCpusInfo,
};

