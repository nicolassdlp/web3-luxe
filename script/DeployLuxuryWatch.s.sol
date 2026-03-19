// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {LuxuryWatch} from "../src/LuxuryWatch.sol";

contract DeployLuxuryWatch is Script {
    function run() public {
        // 1. On charge la clé privée depuis le fichier .env
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // 2. On déduit l'adresse publique du déployeur
        address deployerAddress = vm.addr(deployerPrivateKey);

        // 3. Début de l'enregistrement de la transaction
        vm.startBroadcast(deployerPrivateKey);

        // 4. Déploiement du contrat (on passe le déployeur comme propriétaire initial)
        LuxuryWatch watch = new LuxuryWatch(deployerAddress);

        // 5. Fin de l'enregistrement
        vm.stopBroadcast();

        // 6. Affichage de la fameuse adresse dans le terminal !
        console.log("=== DEPLOIEMENT REUSSI ===");
        console.log("Adresse du contrat LuxuryWatch : ", address(watch));
    }
}