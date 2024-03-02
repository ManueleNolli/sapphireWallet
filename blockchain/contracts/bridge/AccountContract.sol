// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AccountContract is Ownable {
     address private _awa; // ArgentWrappedAccounts contract address

    event Deposit(address indexed from, uint256 value);
    event Execute(address indexed to, uint256 value, bytes data);

    constructor(address initialOwner)
        Ownable(initialOwner)
    {
        _awa = msg.sender;
    }

    modifier onlyOwnerOrAWA() {
        require(msg.sender == owner() || msg.sender == _awa, "Only owner or ArgentWrappedAccounts can call this function");
        _;
    }

    /*
    * @notice Fallback function to receive ether
    */
    fallback() external payable {}

    /**
    * @notice Receive ether
    */
    receive() external payable {}

    /**
    * @notice Deposit ether to smart contract
    */
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        emit Deposit(msg.sender, msg.value);
    }

    function execute(address _to, uint256 _value, bytes calldata _data) public onlyOwnerOrAWA returns (bytes memory) {
        (bool success, bytes memory result) = _to.call{value: _value}(_data);
        require(success, "AccountContract: call failed");
        emit Execute(_to, _value, _data);
        return result;
    }
}
