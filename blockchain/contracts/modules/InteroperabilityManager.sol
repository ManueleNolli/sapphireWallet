// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./common/BaseModule.sol";

abstract contract InteroperabilityManager is BaseModule {

     uint256 private bridgeCallCount = 0;

    // *************** Events *************************** //
    event BridgeCall(uint256 indexed CallID, address indexed wallet, address indexed to, uint256 value, bytes data);


    // *************** External functions ************************ //

    /**
     * @notice Makes the _wallet execute a transaction authorised by the wallet owner.
     * @param _wallet The wallet address.
     * @param _transaction The transaction to be executed.
     * @return The result of the transaction.
     */
    function bridgeCall(
        address _wallet,
        Call calldata _transaction)
        external
        onlySelf()
        onlyWhenUnlocked(_wallet)
        returns (uint256){
        require(_transaction.value != 0 || _transaction.data.length != 0, "InteroperabilityManager: Invalid transaction");
        emit BridgeCall(bridgeCallCount++, _wallet, _transaction.to, _transaction.value, _transaction.data);
        return bridgeCallCount;
    }
}