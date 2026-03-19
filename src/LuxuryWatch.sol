// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LuxuryWatch is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Enregistre le timestamp (date) à partir duquel un token spécifique peut être transféré
    mapping(uint256 => uint256) public nextAllowedTransfer;

    // Définition des durées (en secondes)
    uint256 public constant INITIAL_LOCK_PERIOD = 730 days; // 2 ans
    uint256 public constant TRANSFER_COOLDOWN = 365 days;   // 1 an

    constructor(address initialOwner) 
        ERC721("LuxuryWatch", "LXW") 
        Ownable(initialOwner) 
    {}

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        // Lors de la création, on bloque le premier transfert pour 2 ans
        nextAllowedTransfer[tokenId] = block.timestamp + INITIAL_LOCK_PERIOD;
    }

    // Hook appelé par OpenZeppelin v5 lors de TOUT transfert, mint ou burn
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // On vérifie qu'il s'agit d'un transfert classique (pas un mint, ni un burn)
        if (from != address(0) && to != address(0)) {
            // Vérification du délai
            require(block.timestamp >= nextAllowedTransfer[tokenId], "Transfert non autorise : delai de blocage non ecoule");
            
            // Si le transfert passe, on bloque le suivant pour 1 an
            nextAllowedTransfer[tokenId] = block.timestamp + TRANSFER_COOLDOWN;
        }

        // On exécute le transfert normal
        return super._update(to, tokenId, auth);
    }

    // Overrides obligatoires pour Solidity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}