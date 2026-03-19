"use client";

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useState } from 'react';
import { createWalletClient, custom, parseEther, encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';
import { LUXURY_MARKETPLACE_ADDRESS, luxuryMarketplaceABI } from '@/config/contracts';

import StripeCheckout from './StripeCheckout';

export default function Marketplace() {
  const { authenticated, login } = usePrivy();
  const { wallets } = useWallets();
  const [isBuying, setIsBuying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showStripe, setShowStripe] = useState(false);

  const handleStartPurchase = () => {
    if (!authenticated) {
      login();
      return;
    }
    setShowStripe(true);
  };

  const buyGaslessWatch = async () => {
    // Le wallet [0] est le Smart Wallet généré par Privy si configuré correctement
    const wallet = wallets[0];
    if (!wallet) {
      alert("Aucun wallet connecté. Veuillez vous reconnecter.");
      return;
    }

    setShowStripe(false);
    setIsBuying(true);
    setTxHash(null);

    try {
      await wallet.switchChain(sepolia.id);
      const provider = await wallet.getEthereumProvider();

      const client = createWalletClient({
        account: wallet.address as `0x${string}`,
        chain: sepolia,
        transport: custom(provider),
      });

      // Nous utilisons encodeFunctionData pour préparer l'appel
      const data = encodeFunctionData({
        abi: luxuryMarketplaceABI,
        functionName: 'buyWatch',
        args: ["ipfs://nouveau-metadata-hash-genere"],
      });

      console.log("Préparation de notre UserOperation (Gasless)...");

      // Lorsque l'on appelle sendTransaction sur un SmartWallet (Privy ZeroDev),
      // Privy se charge en coulisse de fabriquer la UserOperation ERC-4337
      // et de la soumettre au Paymaster sponsor pour valider les frais de gaz.
      const hash = await client.sendTransaction({
        to: LUXURY_MARKETPLACE_ADDRESS as `0x${string}`,
        data,
      });

      console.log("Transaction envoyée ! Hash:", hash);
      setTxHash(hash);
      
      alert("La montre est ajoutée à votre coffre !");
    } catch (e: any) {
      console.error("Erreur lors de l'achat:", e);
      alert("L'achat a échoué. " + (e.message || ""));
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 mt-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-light tracking-tighter uppercase leading-none">Vente Primaire</h2>
        <div className="h-px w-16 bg-[#d4bc8d] opacity-50 mx-auto mt-4"></div>
        <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-4">Nouveau stock : Royal Oak Skeleton</p>
      </div>

      <div className="relative group bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-sm p-4 border border-white/5 mx-auto max-w-sm">
        <img 
            src="https://dynamicmedia.audemarspiguet.com/is/image/audemarspiguet/standup-638?fmt=avif-alpha&dpr=off" 
            className="w-full h-64 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,1)] transition-transform duration-700 group-hover:scale-105" 
            alt="Nouvelle Royal Oak" 
        />
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 border border-[#d4bc8d]/40 rounded-full">
          <span className="text-[8px] tracking-widest text-[#d4bc8d] italic font-mono">EDITION LIMITEE</span>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex justify-center items-center border-t border-white/5 pt-6 pb-2">
            <div className="text-center">
              <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Montant</p>
              <p className="text-1xl font-light tracking-widest uppercase">50,000 €</p>
            </div>
          </div>
          
          {isBuying ? (
            <div className="py-6 text-center animate-pulse border border-[#d4bc8d]/20 bg-[#d4bc8d]/5">
              <p className="text-[10px] tracking-[0.4em] text-[#d4bc8d] uppercase">Création du Passeport...</p>
            </div>
          ) : showStripe ? (
            <StripeCheckout 
                amount={5000000} // Montant en centimes = 50 000.00 EUR
                onSuccess={() => buyGaslessWatch()} 
            />
          ) : (
            <button 
              onClick={handleStartPurchase}
              disabled={isBuying}
              className={`w-full py-5 border border-[#d4bc8d] text-black bg-[#d4bc8d] text-[10px] tracking-[0.4em] uppercase hover:bg-[#c9b17f] transition flex items-center justify-center gap-2`}
            >
              {authenticated ? "Procéder au paiement" : "S'identifier pour Acheter"}
            </button>
          )}
          
          {txHash && (
            <div className="text-center mt-4">
              <p className="text-[8px] uppercase text-zinc-500 mb-1">Hash de la Transaction (Sepolia)</p>
              <a 
                href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-[#d4bc8d] font-mono hover:underline"
              >
                {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
