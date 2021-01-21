pragma solidity ^0.5.0;

import "./FakeToken.sol";
import "./lib/SafeMath.sol";

contract Bank {
    using SafeMath for uint;
    address payable public owner;
    FakeToken public fakeToken;

    mapping(address => uint) public balances;
    uint256 totalBalance;
    address[] investors;
    uint totalCustomers;

    struct Deposit {
        address payable lender;
        uint value;
        uint256 date;
    }
    mapping(address => Deposit[]) deposits;

    // event WithdrawAttempt(
    //     address indexed from,
    //     uint256 value
    // );

    constructor(FakeToken _fakeToken) public {
        fakeToken = _fakeToken;
        owner = msg.sender;
    }

    function getTotalBalance() public view returns(uint total) {
        return totalBalance;
    }

    function getBalanceByAddress(address _address) public view returns(uint balance) {
        return balances[_address];
    }

    function getDepositValueById(address _address, uint depositId) public view returns(uint value) {
        uint depositValue = deposits[_address][depositId].value;
        return depositValue;
    }

    function deposit(uint256 date) payable public {
        require(msg.value >= 0, "amount cannot be 0 or less");
        
        Deposit memory newDeposit = Deposit(msg.sender, msg.value, date);
        deposits[msg.sender].push(newDeposit); 

        // fakeToken.transferFrom(msg.sender, address(this), _amount);
        // balances[msg.sender] = balances[msg.sender] + msg.value;
        // totalBalance += msg.value;
        // return balances[msg.sender];
    }

    function withdraw(uint depositId) public {
        // require(balances[msg.sender] >= amount, "Not enough funds");

        uint256 value = deposits[msg.sender][depositId].value;
        require(value > 0, "Not enough funds");
        msg.sender.transfer(value);
        deposits[msg.sender][depositId].value = 0;

        // msg.sender.transfer(amount);
        // balances[msg.sender] = balances[msg.sender] - amount;
        // totalBalance -= amount;
        // return balances[msg.sender];
    }

}