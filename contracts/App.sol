pragma solidity ^0.5.0;

import "./FakeToken.sol";

contract App {
    string public name = "P2P Lending Dapp";
    address payable public owner;
    FakeToken public fakeToken;

    mapping(address => uint) public balances;
    address[] public stackers;

    constructor(FakeToken _fakeToken) public {
        fakeToken = _fakeToken;
        owner = msg.sender;
    }

    function getBalanceByAddress(address _address) public view returns(uint balance) {
        return balances[_address];
    }

    function deposit(uint _amount) payable public {
        require(_amount > 0, "amount cannot be less than 0");
        
        // fakeToken.transferFrom(msg.sender, address(this), _amount);
        owner.transfer(msg.value);
        balances[msg.sender] = balances[msg.sender] + _amount;
        // if (!hasStaked[msg.sender]) {
        //     stackers.push(msg.sender);
        // }
        // isStaking[msg.sender] = true;
        // hasStaked[msg.sender] = true;
    }

    function withdraw(uint _amount) public {
        address payable withdrawer = msg.sender;
        uint balance = balances[withdrawer];
        require(balance > 0, "Widtdraw cannot be 0");
        require(balance >= _amount, "Not enough funds");
        // fakeToken.transfer(msg.sender, _amount);

        withdrawer.transfer(_amount);
        balances[msg.sender] -= _amount;
    }

}