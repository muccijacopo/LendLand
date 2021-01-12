const App = artifacts.require('App');
const FakeToken = artifacts.require('FakeToken');

const toWei = (value) => {
    return web3.utils.toWei(value, 'ether');
};

module.exports = async (deployer, network, accounts) => {
    await deployer.deploy(FakeToken);
    const fakeToken = await FakeToken.deployed();

    await deployer.deploy(App, fakeToken.address);
    const app = await App.deployed();
    // await fakeToken.transfer(app.address, toWei(''));
    await fakeToken.transfer(accounts[1], toWei('1000'));
};
