"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import { publicClient, LUXURY_WATCH_ADDRESS, luxuryWatchABI } from '@/config/contracts';

export default function Home() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  
  // États pour gérer l'affichage de l'interface
  const [scanStatus, setScanStatus] = useState<string>("");
  const [watchData, setWatchData] = useState<{ owner: string; uri: string } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Fonction déclenchée au clic sur "Scanner ma montre"
  const handleNFCScan = async () => {
    setIsScanning(true);
    setScanStatus("Recherche sur la blockchain en cours...");
    setWatchData(null);
    
    try {
      // 1. Simulation : La puce NFC physique correspond à la montre ID 0
      const scannedTokenId = 0n;

      // 2. Interroger la blockchain pour trouver le propriétaire
      const ownerAddress = await publicClient.readContract({
        address: LUXURY_WATCH_ADDRESS as `0x${string}`,
        abi: luxuryWatchABI,
        functionName: 'ownerOf',
        args: [scannedTokenId],
      }) as string;

      // 3. Interroger la blockchain pour récupérer le lien IPFS (Métadonnées)
      const tokenURI = await publicClient.readContract({
        address: LUXURY_WATCH_ADDRESS as `0x${string}`,
        abi: luxuryWatchABI,
        functionName: 'tokenURI',
        args: [scannedTokenId],
      }) as string;

      // 4. Vérifier si l'utilisateur connecté est bien le propriétaire
      const userWalletAddress = user?.wallet?.address;
      
      if (userWalletAddress && userWalletAddress.toLowerCase() === ownerAddress.toLowerCase()) {
        setScanStatus("✅ Authentifié : Vous êtes le propriétaire de cette pièce.");
      } else {
        setScanStatus("❌ Cette montre appartient à un autre portefeuille.");
      }
      
      // On sauvegarde les données pour les afficher
      setWatchData({
        owner: ownerAddress,
        uri: tokenURI
      });

    } catch (error) {
      console.error(error);
      setScanStatus("⚠️ Erreur : Impossible de lire le contrat. L'adresse est-elle correcte ?");
    } finally {
      setIsScanning(false);
    }
  };

  // Écran de chargement le temps que Privy s'initialise
  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-[#D4AF37]">Chargement sécurisé...</div>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white">
      <h1 className="text-4xl font-light mb-8 uppercase tracking-widest text-[#D4AF37] text-center">
        Maison de Haute Horlogerie
      </h1>

      {/* VUE NON CONNECTÉ */}
      {!authenticated ? (
        <div className="flex flex-col items-center">
          <p className="mb-8 text-gray-400 text-center max-w-md">
            Accédez à votre coffre-fort numérique, consultez l'historique de vos pièces et prouvez votre propriété d'un simple geste.
          </p>
          <button 
            onClick={login}
            className="px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-yellow-600 transition duration-300"
          >
            S'authentifier (Email / FaceID)
          </button>
        </div>
      ) : (
        /* VUE CONNECTÉ */
        <div className="flex flex-col items-center w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
          <div className="mb-6 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Identité Sécurisée</p>
            <p className="text-sm text-[#D4AF37] truncate w-64">
              {user?.wallet?.address || 'Portefeuille non généré'}
            </p>
          </div>
          
          {/* Écran du Scanner */}
          <div className="w-full min-h-32 bg-black rounded-xl mb-6 flex flex-col items-center justify-center border border-zinc-800 p-4 text-center">
            <p className={`text-sm ${scanStatus.includes('✅') ? 'text-green-400' : scanStatus.includes('❌') ? 'text-red-400' : 'text-gray-400'}`}>
              {scanStatus || "Approchez votre montre de l'appareil."}
            </p>
            
            {/* Affichage des données de la blockchain si le scan a fonctionné */}
            {watchData && (
              <div className="mt-4 pt-4 border-t border-zinc-800 w-full text-left text-xs text-gray-400 space-y-2">
                <p><span className="text-gray-500">Propriétaire :</span> <br/><span className="truncate block">{watchData.owner}</span></p>
                <p><span className="text-gray-500">Données (IPFS) :</span> <br/><span className="truncate block">{watchData.uri}</span></p>
              </div>
            )}
          </div>

          <button 
            onClick={handleNFCScan}
            disabled={isScanning}
            className={`w-full mb-6 px-8 py-3 bg-white text-black font-semibold rounded-full transition duration-300 ${isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
          >
            {isScanning ? 'Vérification...' : 'Scanner ma montre'}
          </button>

          <button 
            onClick={logout}
            className="text-xs text-zinc-500 hover:text-white transition uppercase tracking-wider"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </main>
  );
}