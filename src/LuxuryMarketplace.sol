// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LuxuryWatch.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LuxuryMarketplace is Ownable {
    LuxuryWatch public watchContract;
    uint256 public constant WATCH_PRICE = 50000 * 10**18; // Exemple : 50,000 unités (Stablecoin)

    event WatchPurchased(address indexed buyer, uint256 tokenId);

    constructor(address _watchContract, address initialOwner) Ownable(initialOwner) {
        watchContract = LuxuryWatch(_watchContract);
    }

    // Fonction de vente primaire
    function buyWatch(string memory uri) public payable {
        // Logique simplifiée : ici on pourrait vérifier un paiement en USDC
        // Pour la démo, on imagine que l'appel de cette fonction déclenche le Mint
        
        watchContract.safeMint(msg.sender, uri);
        emit WatchPurchased(msg.sender, 0); // Simplifié pour l'exemple
    }
}