pragma solidity ^0.5.0;

import "./FakeToken.sol";

contract App {
    string public name = "P2P Lending Dapp";
    FakeToken public fakeToken;

    constructor(FakeToken _fakeToken) public {
        fakeToken = _fakeToken;
    }

}