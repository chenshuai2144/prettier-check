'use strict';

const prettier = require('prettier');
const fs = require('fs');
const getPrettierFiles = require('./getPrettierFiles');
const resolveCwd = require('./resolveCwd');

let didError = false;
let didWarn = false;

const prettierConfigPath = require.resolve(resolveCwd('.prettierrc'));

const check = () => {
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
        if (!isPrettier) {
          console.log(`\x1b[31m ${file} is no prettier, please use npm run prettier \x1b[0m`);
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
