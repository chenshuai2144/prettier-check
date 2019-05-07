const program = require('commander');
const prettierCheck = require('../lint-prettier');
const packageInfo = require('../../package.json');

program.version(packageInfo.version, '-v, --version').parse(process.argv);

const proc = program.runningCommand;

if (proc) {
  proc.on('close', process.exit.bind(process));
  proc.on('error', () => {
    process.exit(1);
  });
}

const subCmd = program.args[0];
if (subCmd === 'h') {
  program.help();
}

if (subCmd === 'lint') {
  prettierCheck();
}

if (subCmd === 'write') {
  prettierCheck('write');
}
