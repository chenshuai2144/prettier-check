'use strict';

const prettier = require('prettier');
const fs = require('fs');
const getPrettierFiles = require('./getPrettierFiles');
const resolveCwd = require('./resolveCwd');
const chalk = require('chalk');

let didError = false;
let didWarn = false;

const prettierConfigPath = require.resolve(resolveCwd('.prettierrc'));

const write = (file, fileInfo, options) => {
  const input = fs.readFileSync(file, 'utf8');
  const withParserOptions = {
    ...options,
    parser: fileInfo.inferredParser,
  };
  const output = prettier.format(input, withParserOptions);
  if (output !== input) {
    fs.writeFileSync(file, output, 'utf8');
    console.log(chalk.green(`${file} is prettier`));
  }
};

const check = type => {
  const files = getPrettierFiles();
  files.forEach(file => {
    Promise.all([
      prettier.resolveConfig(file, {
        config: prettierConfigPath,
      }),
      prettier.getFileInfo(file),
    ])
      .then(resolves => {
        const [options, fileInfo] = resolves;
        if (fileInfo.ignored) {
          return;
        }
        const input = fs.readFileSync(file, 'utf8');
        const withParserOptions = {
          ...options,
          parser: fileInfo.inferredParser,
        };
        const isPrettier = prettier.check(input, withParserOptions);

        if (isPrettier && type === 'write') {
          write(file, fileInfo, withParserOptions);
          return;
        }
        if (!isPrettier) {
          console.log(chalk.red(`${file} is no prettier, please use npm run prettier`));
          didWarn = true;
        }
      })
      .catch(e => {
        didError = true;
        throw e;
      })
      .finally(() => {
        if (didWarn || didError) {
          process.exit(1);
        }
      });
  });
};

module.exports = check;
