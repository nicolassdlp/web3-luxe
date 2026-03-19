// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LuxuryWatch.sol";

contract LuxuryWatchTest is Test {
    LuxuryWatch public watch;
    
    // Définition de plusieurs acteurs pour simuler le cycle de vie de la montre
    address public owner = address(1);
    address public client1 = address(2);
    address public client2 = address(3);
    address public client3 = address(4);

    function setUp() public {
        // Déploiement du contrat par l'owner
        vm.prank(owner);
        watch = new LuxuryWatch(owner);
    }

    // --- TESTS DE BASE ---

    function testOwnerIsDeployer() public view {
        assertEq(watch.owner(), owner);
    }

    function testOnlyOwnerCanMint() public {
        vm.prank(client1);
        vm.expectRevert(); 
        watch.safeMint(client1, "ipfs://hash");
    }

    // --- TESTS DES REGLES DE BLOCAGE TEMPOREL ---

    function testInitialLockPeriod() public {
        // 1. L'owner mint la montre (Token ID 0) pour client1
        vm.prank(owner);
        watch.safeMint(client1, "ipfs://metadata");

        // 2. Client1 essaie de la transférer immédiatement à Client2 (Doit échouer)
        vm.prank(client1);
        vm.expectRevert("Transfert non autorise : delai de blocage non ecoule");
        watch.transferFrom(client1, client2, 0);

        // 3. On avance le temps de 1 an dans la blockchain
        vm.warp(block.timestamp + 365 days);

        // 4. Client1 essaie encore, c'est trop tôt (Doit échouer)
        vm.prank(client1);
        vm.expectRevert("Transfert non autorise : delai de blocage non ecoule");
        watch.transferFrom(client1, client2, 0);

        // 5. On avance le temps pour atteindre les 2 ans (730 jours au total)
        vm.warp(block.timestamp + 365 days);

        // 6. Client1 transfère à Client2 (Doit réussir car les 2 ans sont passés)
        vm.prank(client1);
        watch.transferFrom(client1, client2, 0);
        
        // On vérifie que Client2 est bien le nouveau propriétaire
        assertEq(watch.ownerOf(0), client2);
    }

    function testTransferCooldownPeriod() public {
        // 1. Mint initial par l'owner
        vm.prank(owner);
        watch.safeMint(client1, "ipfs://metadata");
        
        // 2. On avance directement de 2 ans et Client1 transfère à Client2
        vm.warp(block.timestamp + 730 days);
        vm.prank(client1);
        watch.transferFrom(client1, client2, 0);

        // 3. Client2 essaie de transférer immédiatement à Client3 (Doit échouer : cooldown de 1 an)
        vm.prank(client2);
        vm.expectRevert("Transfert non autorise : delai de blocage non ecoule");
        watch.transferFrom(client2, client3, 0);

        // 4. On avance de 364 jours, presque 1 an (Doit échouer)
        vm.warp(block.timestamp + 364 days);
        vm.prank(client2);
        vm.expectRevert("Transfert non autorise : delai de blocage non ecoule");
        watch.transferFrom(client2, client3, 0);

        // 5. On avance de 1 jour supplémentaire pour atteindre pile 1 an
        vm.warp(block.timestamp + 1 days);

        // 6. Le transfert vers Client3 est maintenant autorisé (Doit réussir)
        vm.prank(client2);
        watch.transferFrom(client2, client3, 0);

        // On vérifie que Client3 est le propriétaire final
        assertEq(watch.ownerOf(0), client3);
    }
}