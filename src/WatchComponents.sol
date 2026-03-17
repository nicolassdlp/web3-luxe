// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WatchComponents is ERC1155, Ownable {
    // Identifiants pour les composants 
    uint256 public constant BRACELET = 0;
    uint256 public constant CALIBRE = 1;
    uint256 public constant CADRAN = 2;

    constructor(address initialOwner) 
        ERC1155("https://api.luxury-brand.com/metadata/{id}.json") 
        Ownable(initialOwner) 
    {}

    // Mint par lots pour optimiser le gas 
    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }
}