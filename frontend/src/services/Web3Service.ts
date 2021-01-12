import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

import FakeToken from '../../../build/contracts/FakeToken.json';

class Web3Service {
    web3: Web3;
    token: Contract;

    async init() {
        if (this.isBrowserSupported()) {
            this.web3 = await this.enableEthProvider();
            this.token = await this.createTokenContract();
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
        const [account, _] = await this.web3.eth.getAccounts();
        const balanceWei = (await this.token.methods.balanceOf(account).call()) as string;
        const balance = this.web3.utils.fromWei(balanceWei);
        return balance;
    }

    async deposit(amount: number = 10) {}

    private async createTokenContract() {
        // console.log(abiToken);
        const networkId = (await this.web3.eth.net.getId()).toString();
        const address = FakeToken.networks[networkId].address;
        const abi = FakeToken.abi as AbiItem[];
        return new this.web3.eth.Contract(abi, address);
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
