// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./common/BaseModule.sol";

/**
 * @title InteroperabilityManager
 * @notice Abstract Module to request the wallet to execute a transaction on another chain. Lock and release the wallet's assets.
 * @author Manuele Nolli - <manuele.nolli@supsi.ch>
 */
abstract contract InteroperabilityManager is BaseModule {

     uint256 private bridgeCallCount = 0;


    enum BridgeCallType {
        DEST,  // Call to be executed on the destination chain. Ex: Transfer ETH from the AccountContract in the Destination chain to the someone in the Destination chain
        BRIDGE // Call to be executed on the bridge contract    Ex: Transfer ETH from the source chain to the AccountContract in the destination chain
    }

    struct InteroperabilityCall {
        BridgeCallType callType;
        address to;
        uint256 value;
        bytes data;
    }

    // *************** Events *************************** //
    event BridgeCall(uint256 indexed CallID, address indexed wallet, BridgeCallType indexed callType, address to, uint256 value, bytes data, address owner);


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
        if(_transaction.callType == BridgeCallType.BRIDGE){
            if (_transaction.value != 0) { // ETH transfer
                require(address(_wallet).balance >= _transaction.value, "InteroperabilityManager: Not enough balance");
                (bool _success, ) = invokeWallet(_wallet, address(this), _transaction.value, _transaction.data);
                require(_success, "InteroperabilityManager: Wallet ETH transfer failed");
            } else { // NFT transfer
                revert("InteroperabilityManager: NFT transfer not implemented yet");
                // Transaction Data must be an NFT Call to address(this)
            }
        } else if(_transaction.callType == BridgeCallType.DEST){
            require(_transaction.value == 0, "InteroperabilityManager: Invalid transaction. Value can not be set in type DEST");
            // So, data has some value
        } else {
            revert("InteroperabilityManager: Invalid transaction type");
        }

        emit BridgeCall(bridgeCallCount++, _wallet, _transaction.callType, _transaction.to, _transaction.value, _transaction.data, owner);
        return bridgeCallCount;
    }

    /**
    * @notice Receive ETH for Locking
    */
    receive() external payable {}
}