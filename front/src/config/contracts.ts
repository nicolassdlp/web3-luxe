import { createPublicClient, http, parseAbi } from 'viem';
import { sepolia } from 'viem/chains';

// On initialise la connexion à la blockchain Sepolia en lecture seule
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL),
});

// L'adresse de votre contrat (à remplacer par la vraie après votre déploiement final)
export const LUXURY_WATCH_ADDRESS = "0x70eA90be55895a5d56D49888270a25A595115F2B"; 
export const LUXURY_MARKETPLACE_ADDRESS = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c"; // A remplacer par le vrai déploiement

// On définit uniquement les fonctions dont le front-end a besoin
export const luxuryWatchABI = parseAbi([
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function nextAllowedTransfer(uint256 tokenId) view returns (uint256)"
]);

export const luxuryMarketplaceABI = parseAbi([
  "function buyWatch(string memory uri) public payable"
]);