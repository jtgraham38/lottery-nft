pragma solidity 0.8.16;

contract Test{
    string public message = "";

    constructor() {

    }
    function setMessage(string memory _message) public {
        message = _message;
    }
}