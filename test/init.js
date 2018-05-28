var path = require("path");
require('app-module-path').addPath(path.join(__dirname, ".."));

var chai = require("chai");
var sinonChai = require("sinon-chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(sinonChai);
chai.use(chaiAsPromised);
