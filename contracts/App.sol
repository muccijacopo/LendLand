pragma solidity ^0.5.0;

import "./FakeToken.sol";

contract App {
    string public name = "P2P Lending Dapp";
    FakeToken public fakeToken;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStacked;
    mapping(address => bool) public isStacking;
    address[] public stackers;

    constructor(FakeToken _fakeToken) public {
        fakeToken = _fakeToken;
    }

    function deposit(uint _amount) public {
        fakeToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount; 
        if (!hasStacked[msg.sender]) {
            stackers.push(msg.sender);
        }
        isStacking[msg.sender] = true;
        hasStacked[msg.sender] = true;
    }

    function widthdraw(uint _amount) public {
        fakeToken.transferFrom(address(this), msg.sender, _amount);
    }

}