const sayHi = (user) => {console.log(`Welcome to the File Manager, ${user}!`); sayCurrFolder();};
const sayBye = (user) => {console.log(`Thank you for using File Manager, ${user}, goodbye!`)};
const sayCurrFolder = () => {console.log('You are currently in ' + process.cwd())}

export {sayHi, sayBye, sayCurrFolder}