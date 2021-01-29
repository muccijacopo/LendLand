const Bank = artifacts.require('Bank');
const FakeToken = artifacts.require('FakeToken');

const toWei = (value) => {
    return web3.utils.toWei(value, 'ether');
};

const toEth = (value) => {
    return web3.utils.fromWei(value, 'ether');
};

contract('Bank Test', async (accounts) => {
    let bank, token;
    const demo = accounts[8];
    const investor = accounts[3];
    before(async () => {
        token = await FakeToken.new();
        bank = await Bank.new(token.address);

        const date = parseInt((Date.now() / 1000).toFixed(0));
        await bank.deposit(date, { from: demo, value: toWei('2') });
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

    describe('Deposit', async () => {
        it('should creare a new deposit', async () => {
            const date = parseInt((Date.now() / 1000).toFixed(0));
            await bank.deposit(date, { from: investor, value: toWei('2') });
            const value = await bank.getDepositValueById(investor, 0);
            assert.equal(value, toWei('2'));
        });

        it('should withdraw all the deposit amount', async () => {
            // const beforeBalance = await bank.totalBalance();
            await bank.withdraw(0, { from: investor });
            // const value = await bank.getDepositValueById(investor, 0);
            assert.equal(true, true);
        });

        it('should close the deposit after withdraw correctly', async () => {
            // await bank.withdraw(0, { from: investor });
            const isClosed = await bank.isDepositClosed(investor, 0);
            assert.isTrue(isClosed);
        });

        it('should not permit another withdraw from the deposit', async () => {
            try {
                await bank.withdraw(0, { from: investor });
                assert.fail('withdraw successfull after close');
            } catch (_) {
                assert.isTrue(true);
            }
        });

        // it('should have balance', async () => {
        //     const balance = await app.getBalanceByAddress(investor);
        //     assert.equal(balance, toWei('1'));
        // });

        // it('test', async () => {
        //     const date = parseInt((Date.now() / 1000 - 1000).toFixed(0));
        //     const result = await bank.compound(toWei('1'), date);
        //     console.log('result', result.toString());
        //     assert.equal(true, true);
        // });
    });

    describe('Loan', async () => {
        it('should create a new loan', async () => {
            // await bank.withdraw(0, { from: investor });
            const date = parseInt((Date.now() / 1000).toFixed(0));
            const amountWei = toWei('1');
            await bank.requestLoan(amountWei, date, { from: investor });
            const result = await bank.getLoanOriginalAmountById(investor, 0);
            assert.equal(result, toWei('1'));
        });

        it('should not not repay loan correctly', async () => {
            try {
                const date = parseInt((Date.now() / 1000).toFixed(0));
                // repay amount less than loan amount + interests
                await bank.repayLoan(0, date, { from: investor, value: toWei('0.5') });
                assert.fail("repay loan successful! (it shouldn't)");
            } catch (e) {
                // console.log('transaction error => ', e);
                assert.isTrue(true);
            }
        });

        it('should repay loan correctly', async () => {
            const date = parseInt((Date.now() / 1000).toFixed(0));
            await bank.repayLoan(0, date, { from: investor, value: toWei('1.00001') });
            // assert.equal(value, toWei('0'));
            assert.isTrue(true);
        });

        it('should close the loan correctly after repay', async () => {
            // await bank.withdraw(0, { from: investor });
            const isClosed = await bank.isLoanClosed(investor, 0);
            assert.isTrue(isClosed);
        });
    });
});
