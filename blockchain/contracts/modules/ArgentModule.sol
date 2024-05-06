// Copyright (C) 2021  Argent Labs Ltd. <https://argent.xyz>

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.3;

import "./common/Utils.sol";
import "./common/BaseModule.sol";
import "./RelayerManager.sol";
import "./TransactionManager.sol";
import "./InteroperabilityManager.sol";
import "./SapphireSecurityManager.sol";

/**
 * @title ArgentModule
 * @notice Single module for the Argent wallet with interoperability features.
 * @author Manuele Nolli - <manuele.nolli@supsi.ch>
 */
contract ArgentModule is BaseModule, RelayerManager, TransactionManager, InteroperabilityManager, SapphireSecurityManager {

    bytes32 constant public NAME = "ArgentModule";

    constructor (
        IModuleRegistry _registry,
        IGuardianStorage _guardianStorage,
        ITransferStorage _userWhitelist,
        IAuthoriser _authoriser,
        address _uniswapRouter,
        uint256 _securityPeriod
    )
        BaseModule(_registry, _guardianStorage, _userWhitelist, _authoriser, NAME)
        TransactionManager(_securityPeriod)
        RelayerManager(_uniswapRouter)
    {
        
    }

    /**
     * @inheritdoc IModule
     */
    function init(address _wallet) external override onlyWallet(_wallet) {
        enableDefaultStaticCalls(_wallet);
    }

    /**
    * @inheritdoc IModule
    */
    function addModule(address _wallet, address _module) external override onlyWalletOwnerOrSelf(_wallet) onlyWhenUnlocked(_wallet) {
        require(registry.isRegisteredModule(_module), "AM: module is not registered");
        IWallet(_wallet).authoriseModule(_module, true);
    }
    
    /**
     * @inheritdoc RelayerManager
     */
    function getRequiredSignatures(address _wallet, bytes calldata _data) public view override returns (uint256, OwnerSignature) {
        bytes4 methodId = Utils.functionPrefix(_data);

        if (methodId == TransactionManager.multiCall.selector ||
            methodId == TransactionManager.addToWhitelist.selector ||
            methodId == TransactionManager.removeFromWhitelist.selector ||
            methodId == TransactionManager.enableERC1155TokenReceiver.selector ||
            methodId == TransactionManager.clearSession.selector ||
            methodId == ArgentModule.addModule.selector ||
            methodId == InteroperabilityManager.bridgeCall.selector
        )
        {
            // owner
            return (1, OwnerSignature.Required);
        }
        if (methodId == TransactionManager.multiCallWithSession.selector) {
            return (1, OwnerSignature.Session);
        }
        if (
            methodId == TransactionManager.multiCallWithGuardiansAndStartSession.selector
            )
        {
            // owner + majority of guardians
            uint majorityGuardians = _majorityOfGuardians(_wallet);
            uint numberOfSignaturesRequired = majorityGuardians + 1;
            return (numberOfSignaturesRequired, OwnerSignature.Required);
        }
        if (methodId == TransactionManager.multiCallWithGuardians.selector)
        {
            // just one guardian. This has to be fixed, it should be majority of guardians.
            // Used for recovery in Sapphire systems, just a PoC
            return (1, OwnerSignature.Optional);
        }
        revert("SM: unknown method");
    }

    function _majorityOfGuardians(address _wallet) internal view returns (uint) {
        return Utils.ceil(guardianStorage.guardianCount(_wallet), 2);
    }
}