const Bank = artifacts.require('Bank');
const FakeToken = artifacts.require('FakeToken');

const toWei = (value) => {
    return web3.utils.toWei(value, 'ether');
};

contract('Bank Test', async (accounts) => {
    let bank, token;
    const investor = accounts[3];
    before(async () => {
        token = await FakeToken.new();
        bank = await Bank.new(token.address);
    });

    // describe('Deposit tokens', async () => {
    //     it('deposit should work!', async () => {
    //         const balanceBefore = await token.balanceOf(investor);
    //         assert.equal(balanceBefore, toWei('1000'), 'balance before is not correct');
    //         await token.approve(app.address, toWei('1000'), { from: investor });
    //         await app.deposit(toWei('1000'), { from: investor });

    //         const balanceAfter = await token.balanceOf(investor);
    //         assert.equal(balanceAfter, toWei('0'));

    //         const stakingBalance = await app.stakingBalance(investor);
    //         assert.equal(stakingBalance, toWei('1000'), 'staking balance is not correct');
    //     });
    //     it('should withdraw', async () => {
    //         await app.widthdraw(toWei('100'), { from: investor });
    //         const balanceAfterWithdraw = await token.balanceOf(investor);
    //         assert.equal(balanceAfterWithdraw, toWei('100'));
    //     });
    // });

    describe('Deposit/Withdraw', async () => {
        it('should deposit eth', async () => {
            const date = parseInt((Date.now() / 1000).toFixed(0));
            await bank.deposit(date, { from: investor, value: toWei('2') });
            const value = await bank.getDepositValueById(investor, 0);
            assert.equal(value, toWei('2'));
        });
        it('should withdraw eth', async () => {
            await bank.withdraw(0, { from: investor });
            const value = await bank.getDepositValueById(investor, 0);
            assert.equal(value, toWei('0'));
        });
        // it('should have balance', async () => {
        //     const balance = await app.getBalanceByAddress(investor);
        //     assert.equal(balance, toWei('1'));
        // });
        it('test', async () => {
            const date = parseInt((Date.now() / 1000 - 1000).toFixed(0));
            const result = await bank.compound(toWei('1'), date);
            console.log('result', result.toString());
            assert.equal(true, true);
        });
    });
});
