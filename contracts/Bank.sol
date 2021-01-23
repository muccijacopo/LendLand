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
        address payable owner;
        uint originalAmount;
        uint256 date;
        bool closed;
    }
    mapping(address => Deposit[]) public deposits;

    struct Loan {
        address payable owner;
        uint amount;
        uint date;
        bool closed;
    }
    mapping (address => Loan[]) public loans;

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
        uint depositValue = deposits[_address][depositId].originalAmount;
        return depositValue;
    }

    // Not yet supported WTF
    // function getDepositsByAccount(address _address) public view returns(Deposit[] memory) {
    //     Deposit[] memory accountDeposits = deposits[_address];
    //     return accountDeposits;
    // }

    function getAmountWithInterest(uint amount, uint dateLeft, uint dateRight, uint multiplier) internal pure returns(uint) {
        uint secondPassed = dateLeft - dateRight;
        uint amountWithInterest = amount + (secondPassed * multiplier);
        return amountWithInterest;
    }

    function getDepositsByAccount(address _address) public view returns(uint[] memory, uint[] memory, uint[] memory)  {
        uint depositsNumber = deposits[_address].length;
        uint[] memory originalAmounts = new uint[](depositsNumber);
        uint[] memory actualAmounts = new uint[](depositsNumber);
        uint[] memory dates = new uint[](depositsNumber);
        for(uint i = 0; i < depositsNumber; i ++) {
            uint originalAmount = deposits[_address][i].originalAmount;
            uint date = deposits[_address][i].date;
            uint actualAmount = deposits[_address][i].closed ? 0 : getAmountWithInterest(originalAmount, block.timestamp, date, 100);
            originalAmounts[i] = originalAmount;
            actualAmounts[i] = actualAmount;
            dates[i] = date;
        }

        return (originalAmounts, actualAmounts, dates);
    }

    function deposit(uint256 date) payable public {
        require(msg.value >= 0, "amount cannot be 0 or less");
        
        Deposit memory newDeposit = Deposit(msg.sender, msg.value, date, false);
        deposits[msg.sender].push(newDeposit); 
        totalBalance += msg.value;

        // fakeToken.transferFrom(msg.sender, address(this), _amount);
        // balances[msg.sender] = balances[msg.sender] + msg.value;
        // totalBalance += msg.value;
        // return balances[msg.sender];
    }

    function withdraw(uint depositId) public {
        // require(balances[msg.sender] >= amount, "Not enough funds");

        uint256 value = deposits[msg.sender][depositId].originalAmount;
        uint date = deposits[msg.sender][depositId].date;
        require(value > 0, "Not enough funds");
        uint compoundedValue = getAmountWithInterest(value, block.timestamp, date, 100);
        msg.sender.transfer(compoundedValue);
        deposits[msg.sender][depositId].closed = true;
        totalBalance -= value;

        // msg.sender.transfer(amount);
        // balances[msg.sender] = balances[msg.sender] - amount;
        // totalBalance -= amount;
        // return balances[msg.sender];
    }

    function getLoansByAccount(address account) public view returns(uint[] memory, uint[] memory, uint[] memory) {
        uint loansNumber = loans[account].length;
        uint[] memory originalAmounts = new uint[](loansNumber);
        uint[] memory amountsWithInterest = new uint[](loansNumber);
        uint[] memory dates = new uint[](loansNumber);
        for (uint i = 0; i < loansNumber; i++) {
            uint originalAmount = loans[account][i].amount;
            uint date = loans[account][i].date;
            originalAmounts[i] = originalAmount;
            amountsWithInterest[i] = getAmountWithInterest(originalAmount, block.timestamp, date, 100);
            dates[i] = date;
        }
        return (originalAmounts, amountsWithInterest, dates);
    }

    function requestLoan(uint amount, uint date) public {
        msg.sender.transfer(amount);
        totalBalance -= amount;
        Loan memory newLoan = Loan(msg.sender, amount, date, false);
        loans[msg.sender].push(newLoan);
    }

    function repayLoan(uint loanId, uint date) public payable {
        totalBalance += msg.value;
        loans[msg.sender][loanId].closed = true;
    }
}