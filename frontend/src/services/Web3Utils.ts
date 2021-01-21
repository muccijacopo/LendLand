import Web3 from 'web3';

export const toEth = (value: string) => {
    return Web3.utils.fromWei(value, 'ether');
};

export const toWei = (value: string) => {
    return Web3.utils.toWei(value, 'ether');
};
