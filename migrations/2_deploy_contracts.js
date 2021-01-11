const App = artifacts.require("App");
const FakeToken = artifacts.require("FakeToken");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(FakeToken);
  const fakeToken = await FakeToken.deployed();

  await deployer.deploy(App, fakeToken.address);
  const app = await App.deployed();
  await fakeToken.transfer(app.address, "100000");
  await fakeToken.transfer(accounts[1], "1000");
};
