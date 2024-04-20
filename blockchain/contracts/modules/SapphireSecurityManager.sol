// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./common/BaseModule.sol";

/**
 * @title SapphireSecurityManager
 * @notice Simple module to manage recovery of the wallet. It is just a PoC and should be replaced with a more secure solution (e.g. Argent Security Manager).
 * @author Manuele Nolli - <manuele.nolli@supsi.ch>
 */
abstract contract SapphireSecurityManager is BaseModule {

    mapping(address => mapping(address => bool)) private _guardians; // wallet => guardian => isGuardian

    // *************** Events *************************** //

    event GuardianAdded(address indexed wallet, address indexed guardian);
    event GuardianRemoved(address indexed wallet, address indexed guardian);

    // *************** Modifier ************************ //

    modifier onlyGuardian(address _wallet) {
        require(_guardians[_wallet][msg.sender], "SapphireSecurityManager: caller is not a guardian");
        _;
    }

    // *************** External functions ************************ //

    /**
     * @notice Adds a guardian to the wallet.
     * @param _wallet The wallet address.
     * @param _guardian The guardian address.
     */
    function addGuardian(address _wallet, address _guardian) external onlyWalletOwnerOrSelf(_wallet) onlyWhenUnlocked(_wallet) {
        _guardians[_wallet][_guardian] = true;
        emit GuardianAdded(_wallet, _guardian);
    }

    /**
     * @notice Removes a guardian from the wallet.
     * @param _wallet The wallet address.
     * @param _guardian The guardian address.
     */
    function removeGuardian(address _wallet, address _guardian) external onlyWalletOwnerOrSelf(_wallet) onlyWhenUnlocked(_wallet) {
        _guardians[_wallet][_guardian] = false;
        emit GuardianRemoved(_wallet, _guardian);
    }

    function recoverWallet(address _wallet, address _newOwner) external onlyGuardian(_wallet) onlyWhenUnlocked(_wallet) {
        require(_newOwner != address(0), "SapphireSecurityManager: new owner is the zero address");
        _clearSession(_wallet);
        IWallet(_wallet).setOwner(_newOwner);
    }

    // *************** Public functions ************************ //

    /**
     * @notice Checks if a guardian is authorised on the wallet.
     * @param _wallet The wallet address.
     * @param _guardian The guardian address.
     * @return `true` if the guardian is authorised, otherwise `false`.
     */
    function isGuardian(address _wallet, address _guardian) public view returns (bool) {
        return _guardians[_wallet][_guardian];
    }

}
