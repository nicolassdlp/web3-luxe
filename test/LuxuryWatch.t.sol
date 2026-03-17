// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/LuxuryWatch.sol";

contract LuxuryWatchTest is Test {
    LuxuryWatch public watch;
    address public owner = address(1);
    address public client = address(2);

    function setUp() public {
        // Déploiement du contrat par l'owner
        vm.prank(owner);
        watch = new LuxuryWatch(owner);
    }

    // Vérification que le propriétaire est bien le deployeur
    function testOwnerIsDeployer() public view {
        assertEq(watch.owner(), owner);
    }

    // Vérification de la sécurité du Mint
    function testOnlyOwnerCanMint() public {
        vm.prank(client);
        vm.expectRevert(); 
        watch.safeMint(client, "ipfs://hash");
    }
}