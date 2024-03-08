// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract NFTStorage is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;

    struct originalInfo {
        string originalContractAddress;
        uint256 originalTokenID;
    }

    mapping(uint256 => originalInfo) private originalInfos;

    constructor(address initialOwner)
        ERC721("Argent Bridge NFT Storage", "ABNS")
        Ownable(initialOwner)
    {}

    function safeMint(address to, string memory uri, string memory originalContractAddress, uint256 originalTokenID) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        originalInfos[tokenId] = originalInfo(originalContractAddress, originalTokenID);
    }

    function getOriginalInfo(uint256 tokenId) public view returns (string memory, uint256) {
        return (originalInfos[tokenId].originalContractAddress, originalInfos[tokenId].originalTokenID);
    }

    function burn(uint256 tokenId) public virtual override(ERC721Burnable) {
        super.burn(tokenId);
        originalInfos[tokenId] = originalInfo("", 0);
    }

    // The following functions are overrides required by Solidity.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
