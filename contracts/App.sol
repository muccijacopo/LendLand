pragma solidity ^0.5.0;

import "./FakeToken.sol";
import "./lib/SafeMath.sol";

contract App {
    using SafeMath for uint;
    string public name = "P2P Lending Dapp";
    address payable public owner;
    FakeToken public fakeToken;


    mapping(address => uint) public balances;
    address[] public stackers;

    event WithdrawAttempt(
        address indexed from,
        uint256 value
    );

    constructor(FakeToken _fakeToken) public {
        fakeToken = _fakeToken;
        owner = msg.sender;
    }

    function getBalanceByAddress(address _address) public view returns(uint balance) {
        return balances[_address];
    }

    function deposit() payable public returns(uint updatedBalance) {
        require(msg.value >= 0, "amount cannot be 0 or less");
        
        // fakeToken.transferFrom(msg.sender, address(this), _amount);
        balances[msg.sender] = balances[msg.sender] + msg.value;
        return balances[msg.sender];
        // if (!hasStaked[msg.sender]) {
        //     stackers.push(msg.sender);
        // }
        // isStaking[msg.sender] = true;
        // hasStaked[msg.sender] = true;
    }

    function withdraw(uint amount) public returns (uint _updatedBalance) {
        // address payable withdrawer = msg.sender;
        // uint withdrawValue = msg.value;
        // uint balance = balances[withdrawer];
        // fakeToken.transfer(msg.sender, _amount);
        // uint balance = balances[msg.sender];
        // require(msg.value <= 0, "Withdraw value cannot be 0");
        // require(balance >= msg.value, "Not enough funds");
        require(balances[msg.sender] >= amount, "Not enough funds");
        balances[msg.sender] = balances[msg.sender] - amount;
        return balances[msg.sender];
    }

}