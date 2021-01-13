import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import FakeToken from '../../../build/contracts/FakeToken.json';
import Bank from '../../../build/contracts/App.json';

class Web3Service {
    web3: Web3;
    bank: Contract;
    token: Contract;

    async init() {
        if (this.isBrowserSupported()) {
            this.web3 = await this.enableEthProvider();
            this.token = await this.createTokenContract();
            this.bank = await this.createBankContract();
        }
    }

    async getAccounts() {
        if (!this.web3) return [];
        // const networkId = await this.web3.eth.net.getId();
        // console.log(networkId);
        return await this.web3.eth.getAccounts();
    }

    async getBalance() {
        if (!this.web3) return '';
        const [account] = await this.web3.eth.getAccounts();
        // const balanceWei = (await this.token.methods.balanceOf(account).call()) as string;
        const balanceWei = await this.bank.methods.stakingBalance(account).call();
        const balance = this.web3.utils.fromWei(balanceWei);
        return balance;
    }

    async deposit(amount: number) {
        const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
        const [account] = await this.getAccounts();
        this.web3.eth.sendTransaction;
        await this.bank.methods.deposit(amountWei).send({ from: account, value: amountWei });
    }

    // async withdraw(amount: number) {
    //     const amountWei = this.web3.utils.toWei(amount.toString(), 'ether');
    //     const [account] = await this.getAccounts();
    //     this.web3.eth.sendTransaction;
    //     await this.bank.methods.withdraw(amountWei).send({ from: account, value: amountWei });
    // }

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
        return await new Web3(ethProvider);
    }
}

export default new Web3Service();
