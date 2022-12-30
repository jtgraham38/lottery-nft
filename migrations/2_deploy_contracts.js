const Test = artifacts.require("Test");
 
module.exports = function(deployer) {
  deployer.deploy(Test);
};
 
//migration files allow contracts to be put on the blockchain