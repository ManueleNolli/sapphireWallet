// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AccountContract.sol";

contract ArgentWrappedAccounts is Ownable {
    event Deposit(address indexed from, address indexed to, uint256 value);
    event AccountContractCreated(address indexed wallet, address indexed accountContract);
    event TransactionExecuted(address indexed wallet, bool success, bytes returnData, bytes32 signHash);

    mapping (address => address) private accountContracts; // address on base chain => address on side chain (both are contracts)

    constructor()
        Ownable(msg.sender)
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
    * @notice Deposit ether to account contract
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

    function execute(address _wallet, address _owner, bytes calldata _data, bytes calldata _signature) public onlyOwner returns (bool res, bytes memory) {

        address accountContract = accountContracts[_wallet];
        require(accountContract != address(0), "Account contract does not exist");

        bytes32 hash = getSignHash(_wallet, _data);
        address signer = recoverSigner(hash, _signature);

        require(signer == _owner, "Invalid signature");

        (bool success, bytes memory result) = address(accountContract).call(_data);
        emit TransactionExecuted(_wallet, success, result, hash);
        return (success, result);
    }

    function getSignHash(
        address _wallet,
        bytes memory _data
    )
    internal
    view
    returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(
                    bytes1(0x19),
                    bytes1(0),
                    _wallet,
                    _data,
                    block.chainid))
            ));
    }

    function recoverSigner(bytes32 _hash, bytes memory _signature) public pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Check the signature length
        if (_signature.length != 65) {
            return address(0);
        }

        // Divide the signature in r, s and v variables
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }

        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature unique
        if (v < 27) {
            v += 27;
        }

        // If the signature is valid (and not malleable), return the signer address
        if (v != 27 && v != 28) {
            return address(0);
        } else {
            return ecrecover(_hash, v, r, s);
        }
    }
}
