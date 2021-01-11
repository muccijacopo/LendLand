const App = artifacts.require('App');
const FakeToken = artifacts.require('FakeToken');

const toWei = (value) => {
    return web3.utils.toWei(value, 'ether');
};

contract('App Test', async ([owner, investor]) => {
    let app, token;
    before(async () => {
        token = await FakeToken.new();
        app = await App.new(token.address);
        await token.transfer(investor, toWei('1000'), { from: owner });
    });

    it('should contract have a name', async () => {
        const name = await app.name();
        assert.equal(name, 'P2P Lending Dapp');
    });
    it('should investor has funds', async () => {
        const balance = await token.balanceOf(investor);
        assert.equal(balance, toWei('1000'));
    });

    describe('Deposit tokens', async () => {
        it('deposit should work!', async () => {
            const balanceBefore = await token.balanceOf(investor);
            assert.equal(balanceBefore, toWei('1000'), 'balance before is not correct');
            await token.approve(app.address, toWei('1000'), { from: investor });
            await app.deposit(toWei('1000'), { from: investor });

            const balanceAfter = await token.balanceOf(investor);
            assert.equal(balanceAfter, toWei('0'));

            const stakingBalance = await app.stakingBalance(investor);
            assert.equal(stakingBalance, toWei('1000'), 'staking balance is not correct');
        });
        it('should withdraw', async () => {
            await app.widthdraw(toWei('100'), { from: investor });
            const balanceAfterWithdraw = await token.balanceOf(investor);
            assert.equal(balanceAfterWithdraw, toWei('100'));
        });
    });
});
