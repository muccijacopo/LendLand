const Bank = artifacts.require('Bank');
const FakeToken = artifacts.require('FakeToken');

const toWei = (value) => {
    return web3.utils.toWei(value, 'ether');
};

module.exports = async (deployer, network, accounts) => {
    await deployer.deploy(FakeToken);
    const fakeToken = await FakeToken.deployed();

    await deployer.deploy(Bank, fakeToken.address);
    await Bank.deployed();
    await fakeToken.transfer(accounts[1], toWei('1000'));
};
