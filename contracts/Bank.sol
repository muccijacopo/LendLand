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
    mapping(address => Deposit[]) public deposits;

    uint depositRatio = 1;

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

    // Not yet supported WTF
    // function getDepositsByAccount(address _address) public view returns(Deposit[] memory) {
    //     Deposit[] memory accountDeposits = deposits[_address];
    //     return accountDeposits;
    // }

    function compound(uint principal, uint date) internal view returns(uint) {
        // uint updatedPrincipal = principal;
        uint secondPassed = block.timestamp - date;
        uint compounded = principal + (secondPassed * 100);
        return compounded;
        // return secondPassed;
    }

    function getDepositsByAccount(address _address) public view returns(uint[] memory, uint[] memory)  {
        uint depositsNumber = deposits[_address].length;
        uint[] memory values = new uint[](depositsNumber);
        uint[] memory dates = new uint[](depositsNumber);
        for(uint i = 0; i < depositsNumber; i ++) {
            values[i] = deposits[_address][i].value;
            dates[i] = deposits[_address][i].date;
        }

        return (values, dates);
    }

    function deposit(uint256 date) payable public {
        require(msg.value >= 0, "amount cannot be 0 or less");
        
        Deposit memory newDeposit = Deposit(msg.sender, msg.value, date);
        deposits[msg.sender].push(newDeposit); 
        totalBalance += msg.value;

        // fakeToken.transferFrom(msg.sender, address(this), _amount);
        // balances[msg.sender] = balances[msg.sender] + msg.value;
        // totalBalance += msg.value;
        // return balances[msg.sender];
    }

    function withdraw(uint depositId) public {
        // require(balances[msg.sender] >= amount, "Not enough funds");

        uint256 value = deposits[msg.sender][depositId].value;
        uint date = deposits[msg.sender][depositId].date;
        require(value > 0, "Not enough funds");
        uint compoundedValue = compound(value, date);
        msg.sender.transfer(compoundedValue);
        deposits[msg.sender][depositId].value = 0;
        totalBalance -= value;

        // msg.sender.transfer(amount);
        // balances[msg.sender] = balances[msg.sender] - amount;
        // totalBalance -= amount;
        // return balances[msg.sender];
    }
}