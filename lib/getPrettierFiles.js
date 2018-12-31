'use strict';

const resolveCwd = require('./resolveCwd');
const glob = require('glob');

const getPrettierFiles = () => {
  const pkg = require(resolveCwd('package.json'));
  if (pkg.checkFiles && Array.isArray(pkg.checkFiles)) {
    let files = [];
    pkg.checkFiles.map(path => {
      files = files.concat(glob.sync(path, { ignore: ['**/node_modules/**', 'build/**'] }));
    });
    if (!files.length) {
      return [];
    }
    return files;
  }
  return [];
};

module.exports = getPrettierFiles;
