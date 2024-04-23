// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./common/BaseModule.sol";
import "./SecurityManager.sol";

/**
 * @title SapphireSecurityManager
 * @notice Simple module to manage recovery of the wallet. It is just a PoC and should be replaced with a more secure solution (e.g. Argent Security Manager).
 * @author Manuele Nolli - <manuele.nolli@supsi.ch>
 */
abstract contract SapphireSecurityManager is BaseModule {

    // *************** Events *************************** //

    event RecoveryFinalized(address indexed wallet, address indexed _recovery);
    event GuardianAdded(address indexed wallet, address indexed guardian);
    event GuardianRevoked(address indexed wallet, address indexed guardian);

    // *************** Modifiers ************************ //

    /**
     * @notice Throws if the caller is not a guardian for the wallet or the module itself.
     */
    modifier onlyWalletOwnerOrGuardianOrSelf(address _wallet) {
        require(_isOwner(_wallet, msg.sender) || _isSelf(msg.sender) || isGuardian(_wallet, msg.sender), "SSM: must be owner/guardian/self");
        _;
    }

    // *************** External functions ************************ //

    /**
     * @notice Lets the owner add a guardian to its wallet.
     * @param _wallet The target wallet.
     * @param _guardian The guardian to add.
     */
    function addGuardian(address _wallet, address _guardian) external onlyWalletOwnerOrSelf(_wallet) {
        require(!_isOwner(_wallet, _guardian), "SSM: guardian cannot be owner");
        require(!isGuardian(_wallet, _guardian), "SSM: duplicate guardian");
        // Guardians must either be an EOA or a contract with an owner()
        // method that returns an address with a 25000 gas stipend.
        // Note that this test is not meant to be strict and can be bypassed by custom malicious contracts.
        (bool success,) = _guardian.call{gas: 25000}(abi.encodeWithSignature("owner()"));
        require(success, "SSM: must be EOA/Argent wallet");

        guardianStorage.addGuardian(_wallet, _guardian);
        emit GuardianAdded(_wallet, _guardian);
    }

    /**
     * @notice Lets the owner revoke a guardian from its wallet.
     * @param _wallet The target wallet.
     * @param _guardian The guardian to revoke.
     */
    function revokeGuardian(address _wallet, address _guardian) external onlyWalletOwnerOrSelf(_wallet) {
        require(isGuardian(_wallet, _guardian), "SSM: must be existing guardian");

        guardianStorage.revokeGuardian(_wallet, _guardian);
        emit GuardianRevoked(_wallet, _guardian);
    }

    /**
     * @notice Lets the guardians start the execution of the recovery procedure.
     * Once triggered the recovery is pending for the security period before it can be finalised.
     * Must be confirmed by N guardians, where N = ceil(Nb Guardians / 2).
     * @param _wallet The target wallet.
     * @param _recovery The address to which ownership should be transferred.
     */
    function executeRecovery(address _wallet, address _recovery) external onlyWalletOwnerOrGuardianOrSelf(_wallet) {
        validateNewOwner(_wallet, _recovery);
        _clearSession(_wallet);
        IWallet(_wallet).setOwner(_recovery);
        emit RecoveryFinalized(_wallet, _recovery);
    }

    /**
     * @notice Get the active guardians for a wallet.
     * @param _wallet The target wallet.
     * @return _guardians the active guardians for a wallet.
     */
    function getGuardians(address _wallet) external view returns (address[] memory _guardians) {
        return guardianStorage.getGuardians(_wallet);
    }


    // *************** Public functions ************************ //

        /**
     * @notice Checks if an address is a guardian for a wallet.
     * @param _wallet The target wallet.
     * @param _guardian The address to check.
     * @return _isGuardian `true` if the address is a guardian for the wallet otherwise `false`.
     */
    function isGuardian(address _wallet, address _guardian) public view returns (bool _isGuardian) {
        return guardianStorage.isGuardian(_wallet, _guardian);
    }

    // *************** Internal Functions ********************* //

    function validateNewOwner(address _wallet, address _newOwner) internal view {
        require(_newOwner != address(0), "SSM: new owner cannot be null");
        require(!isGuardian(_wallet, _newOwner), "SSM: new owner cannot be guardian");
    }
}
