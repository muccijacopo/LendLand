import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import FakeToken from '../../../build/contracts/FakeToken.json';
import Bank from '../../../build/contracts/App.json';

class Web3Service {
    web3: Web3;
    account: string;
    bank: Contract;
    token: Contract;

    async init() {
        if (this.isBrowserSupported()) {
            this.web3 = await this.enableEthProvider();
            this.account = await this.getAccount();
            this.token = await this.createTokenContract();
            this.bank = await this.createBankContract();
        }
    }

    private async getAccount() {
        // const networkId = await this.web3.eth.net.getId();
        // console.log(networkId);
        const [account] = await this.web3.eth.getAccounts();
        return account;
    }

    async getTotalBalance() {
        const balance = await this.bank.methods.getTotalBalance().call();
        return this.web3.utils.fromWei(balance, 'ether');
    }

    async getBalance() {
        if (!this.web3) return '';
        // const balanceWei = (await this.token.methods.balanceOf(account).call()) as string;
        const balanceWei = await this.bank.methods.getBalanceByAddress(this.account).call();
        const balance = this.web3.utils.fromWei(balanceWei);
        return balance;
    }

    async getBalances() {
        const [userBalance, totalBalance] = await Promise.all([
            this.getBalance(),
            this.getTotalBalance(),
        ]);
        return [userBalance, totalBalance];
    }

    async deposit(amount: number) {
        const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
        // this.web3.eth.sendTransaction;
        await this.bank.methods.deposit().send({ from: this.account, value: amountWei });
        return await this.getBalances();
    }

    async withdraw(amount: number) {
        const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
        await this.bank.methods.withdraw(amountWei).send({ from: this.account });
        return await this.getBalances();
    }

    private async getNetworkId() {
        return (await this.web3.eth.net.getId()).toString();
    }

    private async createTokenContract() {
        // console.log(abiToken);
        // const networkId = (await this.web3.eth.net.getId()).toString();
        const networkId = await this.getNetworkId();
        const address = FakeToken.networks[networkId]?.address;
        const abi = FakeToken.abi as AbiItem[];
        return new this.web3.eth.Contract(abi, address);
    }

    private async createBankContract() {
        const networkId = await this.getNetworkId();
        const contractAddress = Bank.networks[networkId]?.address;
        const contractAbi = Bank.abi as AbiItem[];
        return new this.web3.eth.Contract(contractAbi, contractAddress);
    }

    private isBrowserSupported() {
        const ethProvider = (window as any).ethereum;
        return ethProvider;
    }

    private async enableEthProvider() {
        const ethProvider = (window as any).ethereum;
        await ethProvider.enable();
        return new Web3(ethProvider);
    }
}

export default new Web3Service();
