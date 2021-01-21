import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import FakeToken from '../../../build/contracts/FakeToken.json';
import Bank from '../../../build/contracts/Bank.json';
import { Deposit } from '@/models/Deposit';
import { toEth } from './Web3Utils';

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

    async getBalance(id: number) {
        if (!this.web3) return '';
        // const balanceWei = (await this.token.methods.balanceOf(account).call()) as string;
        const balanceWei = await this.bank.methods.getDepositValueById(this.account, id).call();
        const balance = this.web3.utils.fromWei(balanceWei);
        console.log(balance);
        return balance;
    }

    async getDepositsByAccount(account: string = this.account) {
        const response = await this.bank.methods.getDepositsByAccount(account).call();
        const deposits: Deposit[] = [];
        const AMOUNT = 0;
        const DATE = 1;
        for (let i = 0; i < response[AMOUNT].length; i++) {
            const deposit = {
                id: i,
                value: toEth(response[AMOUNT][i]),
                date: new Date(response[DATE][i] * 1000),
            } as Deposit;
            deposits.push(deposit);
        }
        console.log(deposits);
        return deposits;
    }

    // async getBalances() {
    //     const [userBalance, totalBalance] = await Promise.all([
    //         this.getBalance(),
    //         this.getTotalBalance(),
    //     ]);
    //     return [userBalance, totalBalance];
    // }

    async deposit(amount: number) {
        const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
        // this.web3.eth.sendTransaction;
        const date = parseInt((Date.now() / 1000).toFixed(0));
        await this.bank.methods.deposit(date).send({ from: this.account, value: amountWei });
        return await this.getDepositsByAccount(this.account);
    }

    async withdraw(depositId: number) {
        await this.bank.methods.withdraw(depositId).send({ from: this.account });
        return await this.getDepositsByAccount(this.account);
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
