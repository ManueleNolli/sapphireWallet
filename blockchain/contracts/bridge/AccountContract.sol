// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AccountContract is Ownable {

    constructor(address initialOwner)
        Ownable(initialOwner)
    {}

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
    }

    function execute(address _to, uint256 _value, bytes calldata _data) public onlyOwner returns (bytes memory) {
        (bool success, bytes memory result) = _to.call{value: _value}(_data);
        require(success, "Transaction failed");
        return result;
    }
}
