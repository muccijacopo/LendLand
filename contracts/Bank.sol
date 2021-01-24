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
        uint amount;
        uint256 date;
        bool isClosed;
    }
    mapping(address => Deposit[]) public deposits;

    struct Loan {
        address payable owner;
        uint amount;
        uint date;
        bool isClosed;
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
        uint depositValue = deposits[_address][depositId].amount;
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

    function getDepositsByAccount(address _address) public view returns(uint[] memory, uint[] memory, uint[] memory, bool[] memory)  {
        uint depositsNumber = deposits[_address].length;
        uint[] memory originalAmounts = new uint[](depositsNumber);
        uint[] memory amountsWithInterest = new uint[](depositsNumber);
        uint[] memory dates = new uint[](depositsNumber);
        bool[] memory isClosedAry = new bool[](depositsNumber);
        for(uint i = 0; i < depositsNumber; i ++) {
            uint originalAmount = deposits[_address][i].amount;
            uint date = deposits[_address][i].date;
            bool isClosed = deposits[_address][i].isClosed;
            uint amountWithInterest = getAmountWithInterest(originalAmount, block.timestamp, date, 100);
            originalAmounts[i] = originalAmount;
            amountsWithInterest[i] = amountWithInterest;
            dates[i] = date;
            isClosedAry[i] = isClosed; 
        }

        return (originalAmounts, amountsWithInterest, dates, isClosedAry);
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
        uint256 originalAmount = deposits[msg.sender][depositId].amount;
        uint date = deposits[msg.sender][depositId].date;
        bool isClosed = deposits[msg.sender][depositId].isClosed;
        require(originalAmount > 0, "Deposit is empty");
        require(!isClosed, "Deposit is closed");

        uint compoundedValue = getAmountWithInterest(originalAmount, block.timestamp, date, 100);
        msg.sender.transfer(compoundedValue);
        deposits[msg.sender][depositId].isClosed = true;
        totalBalance -= compoundedValue;
    }

    function getLoansByAccount(address account) public view returns(uint[] memory, uint[] memory, uint[] memory, bool[] memory) {
        uint loansNumber = loans[account].length;
        uint[] memory originalAmounts = new uint[](loansNumber);
        uint[] memory amountsWithInterest = new uint[](loansNumber);
        uint[] memory dates = new uint[](loansNumber);
        bool[] memory isClosedAry = new bool[](loansNumber);
        for (uint i = 0; i < loansNumber; i++) {
            uint originalAmount = loans[account][i].amount;
            uint date = loans[account][i].date;
            bool isClosed = loans[account][i].isClosed;
            originalAmounts[i] = originalAmount;
            amountsWithInterest[i] = getAmountWithInterest(originalAmount, block.timestamp, date, 1000);
            dates[i] = date;
            isClosedAry[i] = isClosed;
        }
        return (originalAmounts, amountsWithInterest, dates, isClosedAry);
    }

    function requestLoan(uint amount, uint date) public {
        msg.sender.transfer(amount);
        totalBalance -= amount;
        Loan memory newLoan = Loan(msg.sender, amount, date, false);
        loans[msg.sender].push(newLoan);
    }

    function repayLoan(uint loanId, uint date) public payable {
        // uint originalAmount = loans[msg.sender][loanId].amount;
        // uint loanDate = loans[msg.sender][loanId].date;
        // uint amountWithInterest = getAmountWithInterest(originalAmount, loanDate, date, 1000);
        // require(msg.value == amountWithIntest, "Need more money!");
        totalBalance += msg.value;
        loans[msg.sender][loanId].isClosed = true;
    }
}