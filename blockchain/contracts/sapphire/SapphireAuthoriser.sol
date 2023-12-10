import "../infrastructure/IAuthoriser.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/*
* @title SapphireAuthoriser
* @notice Authoriser that allows any call to a whitelisted address. A simpler contract than the DappRegistry of Argent.
*/
contract SapphireAuthoriser is IAuthoriser, Ownable  {
    event Authorised(address indexed _address, bool indexed _isAuthorised);
    mapping(address => bool) public authorised;

    constructor()
        Ownable(msg.sender)
    {}

    function setAuthorised(address _address, bool _isAuthorised) external onlyOwner {
        authorised[_address] = _isAuthorised;
        emit Authorised(_address, _isAuthorised);
    }

    /**
    * @notice Returns whether a (_spender, _to, _data) call is authorised for a wallet
    * @param _wallet The wallet. NOT USED!!!
    * @param _spender The spender of the tokens for token approvals, or the target of the transaction otherwise
    * @param _to The target of the transaction
    * @param _data The calldata of the transaction
    */
    function isAuthorised(address _wallet, address _spender, address _to, bytes calldata _data) external view override returns (bool) {
        return authorised[_spender] || authorised[_to];
    }

     function areAuthorised(
        address _wallet,
        address[] calldata _spenders,
        address[] calldata _to,
        bytes[] calldata _data
    )
        external
        view
        override
        returns (bool)
    {
        for (uint256 i = 0; i < _spenders.length; i++) {
            if (authorised[_spenders[i]] || authorised[_to[i]]) {
                return true;
            }
        }
        return false;
    }






}