// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./common/BaseModule.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "hardhat/console.sol";

/**
 * @title InteroperabilityManager
 * @notice Abstract Module to request the wallet to execute a transaction on another chain. Lock and release the wallet's assets.
 * @author Manuele Nolli - <manuele.nolli@supsi.ch>
 */
abstract contract InteroperabilityManager is BaseModule {

     uint256 private bridgeCallCount = 0;


    enum BridgeCallType {
        DEST,       // Generic Call to be executed on the destination chain.    Ex: Transfer ETH from the AccountContract in the Destination chain to the someone in the Destination chain
        BRIDGE_ETH, // Call to be executed on the bridge contract               Ex: Transfer ETH from the source chain to the AccountContract in the destination chain
        BRIDGE_NFT  // Call to be executed on the bridge contract               Ex: Transfer NFT from the source chain to the AccountContract in the destination chain
    }

    struct InteroperabilityCall {
        BridgeCallType callType;
        address to;
        uint256 value;
        bytes data;
        bytes signature;
    }

    // *************** Events *************************** //
    event BridgeCall(uint256 indexed CallID, address indexed wallet, BridgeCallType indexed callType, address to, uint256 value, bytes data, bytes signature, address owner);


    // *************** External functions ************************ //

    /**
     * @notice Makes the _wallet execute a transaction authorised by the wallet owner.
     * @param _wallet The wallet address.
     * @param _transaction The transaction to be executed.
     * @return The result of the transaction.
     */
    function bridgeCall(
        address _wallet,
        InteroperabilityCall calldata _transaction)
        external
        onlySelf()
        onlyWhenUnlocked(_wallet)
        returns (uint256){
        require(
            (_transaction.value != 0 && _transaction.data.length == 0) ||
            (_transaction.value == 0 && _transaction.data.length != 0),
            "InteroperabilityManager: Invalid transaction. Only value or data can be set"
        );
        address owner = IWallet(_wallet).owner();
        if(_transaction.callType == BridgeCallType.BRIDGE_ETH) { // ETH transfer

            //1. Value must be set
            require(_transaction.value != 0, "InteroperabilityManager: Invalid transaction. Value must be set in type BRIDGE_ETH");

            //2. Check if the wallet has enough balance
            require(address(_wallet).balance >= _transaction.value, "InteroperabilityManager: Not enough balance");

            //3. invokeWallet
            (bool _success, ) = invokeWallet(_wallet, address(this), _transaction.value, _transaction.data);
            require(_success, "InteroperabilityManager: Wallet ETH transfer failed");

        } else if (_transaction.callType == BridgeCallType.BRIDGE_NFT) { // NFT transfer
            require(_transaction.value == 0, "InteroperabilityManager: Invalid transaction. Value can not be set in type BRIDGE_NFT");

            //1.  Transaction Data must be an NFT Call to address(this), data has form of ERC721.safeTransferFrom(address,address,uint256)
            require(_transaction.data.length >= 100, "InteroperabilityManager: Invalid transaction. Data has to be at least 100 bytes long"); // 4 bytes for method signature, 32 bytes for each address, 32 bytes for uint256

            bytes4 methodSignature = bytes4(_transaction.data[:4]);
            (address txFrom, address txTo, uint txNftId) = abi.decode(_transaction.data[4:], (address, address, uint256));

            require(
                methodSignature == bytes4(keccak256("safeTransferFrom(address,address,uint256)")),
                "InteroperabilityManager: Invalid transaction. Data must be a call to safeTransferFrom"
            );

            require(
                txTo == address(this),
                "InteroperabilityManager: Invalid transaction. Data must be a call to safeTransferFrom, where to value is this contract"
            );

            //2. Check if _wallet is owner of the NFT
            require(
                txFrom == _wallet,
                "InteroperabilityManager: Invalid transaction. Data must be a call to safeTransferFrom, where from value is the owner"
            );

            //3. invokeWallet
            (bool _success, ) = invokeWallet(_wallet, _transaction.to, 0, _transaction.data);
            require(_success, "InteroperabilityManager: NFT transfer to InteroperabilityManager failed");

            //4. Check if the NFT is transferred to this contract
            require(
                IERC721(_transaction.to).ownerOf(txNftId) == address(this),
                "InteroperabilityManager: Unable to check if NFT is transferred to this contract."
            );

        } else if(_transaction.callType == BridgeCallType.DEST){ // Generic call to the destination chain
            // 1. Data must be set
            require(_transaction.value == 0, "InteroperabilityManager: Invalid transaction. Value can not be set in type DEST");

            // 2. Signature must be set
            require(_transaction.signature.length != 0, "InteroperabilityManager: Invalid transaction. Signature must be set in type DEST");

        } else {
            revert("InteroperabilityManager: Invalid transaction type");
        }

        emit BridgeCall(bridgeCallCount++, _wallet, _transaction.callType, _transaction.to, _transaction.value, _transaction.data, _transaction.signature, owner);
        return bridgeCallCount;
    }

    /**
    * @notice Receive ETH for Locking
    */
    receive() external payable {}
}