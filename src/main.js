const path = require('path');

const rootPath = path.resolve(`${__dirname}/..`);
require('app-module-path').addPath(rootPath);