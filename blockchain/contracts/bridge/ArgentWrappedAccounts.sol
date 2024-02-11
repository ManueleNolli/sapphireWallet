// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AccountContract.sol";

contract ArgentWrappedAccounts is Ownable {
    event Deposit(address indexed from, address indexed to, uint256 value);
    event AccountContractCreated(address indexed wallet, address indexed accountContract);


    mapping (address => address) private accountContracts; // address on base chain => address on side chain (both are contracts)

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
        emit Deposit(msg.sender, address(this), msg.value);
    }

    /**
    * @notice Deposit ether to account contract (tr
    * @param _wallet The address of base chain wallet
    */
    function depositToAccountContract(address _wallet, uint256 _value) onlyOwner public {
        require(_value > 0, "Deposit amount must be greater than 0");
        require(_value < address(this).balance, "Insufficient balance inside ArgentWrappedAccounts");

        address accountContract = accountContracts[_wallet];
        if (accountContract == address(0)) {
            accountContract = createAccountContract(_wallet);
        }

        AccountContract(payable(accountContract)).deposit{value: _value}();
        emit Deposit(address(this),accountContract, _value);
    }

    /**
    * @notice Withdraw ether from smart contract
    * @param _wallet The address of base chain wallet
    */
    function createAccountContract(address _wallet) public onlyOwner returns (address) {
        require(accountContracts[_wallet] == address(0), "Account contract already exists");
        address AccountContractAddress = address(new AccountContract(_wallet));
        accountContracts[_wallet] = AccountContractAddress;

        emit AccountContractCreated(_wallet, AccountContractAddress);

        return AccountContractAddress;
    }

    /**
    * @notice Return the address of account contract (side chain)
    * @param _wallet The address of base chain wallet
    */
    function getAccountContract(address _wallet) public view returns (address) {
        return accountContracts[_wallet];
    }

//    function execute(address _wallet, bytes calldata _data) public onlyOwner returns (bytes memory) {
//        require(accountContracts[_wallet] != address(0), "Account contract not found");
//        return AccountContract(accountContracts[_wallet]).execute(_data);
//    }

//    /**
//    * @notice Checks that the wallet address provided as the first parameter of _data matches the side chain address.
//    * @return false if the addresses are different.
//    */
//    function verifyData(address _wallet, bytes calldata _data) internal view returns (bool) {
//        require(_data.length >= 36, "RM: Invalid dataWallet");
//        address dataWallet = abi.decode(_data[4 :], (address));
//        return dataWallet == accountContracts[_wallet];
//    }
}
