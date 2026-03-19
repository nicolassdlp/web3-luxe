"use client";

import { useState, useEffect } from 'react';
import { publicClient, LUXURY_WATCH_ADDRESS, luxuryWatchABI } from '@/config/contracts';

interface TransferModuleProps {
  watchDetails: any;
  userWallet: string | undefined;
  onTransferSuccess: () => void;
}

export default function TransferModule({ watchDetails, userWallet, onTransferSuccess }: TransferModuleProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [sellMode, setSellMode] = useState<"boutique" | "p2p" | null>(null);
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const [isLocked, setIsLocked] = useState(true); // Locked by default while loading
  const [availableDate, setAvailableDate] = useState<string>("Vérification blockchain...");

  useEffect(() => {
    const checkLockStatus = async () => {
      try {
        const tokenId = 0n;
        const nextTimestamp = await publicClient.readContract({
          address: LUXURY_WATCH_ADDRESS as `0x${string}`,
          abi: luxuryWatchABI,
          functionName: 'nextAllowedTransfer',
          args: [tokenId],
        }) as bigint;

        const now = BigInt(Math.floor(Date.now() / 1000));
        
        if (nextTimestamp > now) {
          setIsLocked(true);
          const date = new Date(Number(nextTimestamp) * 1000);
          setAvailableDate(date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
        } else {
          setIsLocked(false);
        }
      } catch (e) {
        console.error("Erreur lecture registre:", e);
      }
    };
    checkLockStatus();
  }, []);

  const handleRequestAuthorization = async () => {
    if (sellMode === 'p2p' && (!recipient.startsWith('0x') || recipient.length !== 42)) {
      alert("Veuillez renseigner une identité numérique valide.");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onTransferSuccess();
      }, 5000);
    }, 2000);
  };

  if (status === "success") {
    return (
      <div className="p-6 border border-[#d4bc8d]/30 bg-[#d4bc8d]/5 text-center animate-in fade-in duration-500">
        <p className="text-[10px] text-[#d4bc8d] tracking-[0.3em] font-bold uppercase">Demande envoyée</p>
        <p className="text-[8px] text-zinc-400 mt-3 uppercase tracking-widest leading-relaxed">
          Votre demande d'autorisation de {sellMode === 'boutique' ? "mise en vente sur la boutique" : "cession privée"} est en attente d'acceptation par la manufacture Audemars Piguet.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {/* VÉRIFICATION DE LA RÉTENTION */}
      {isLocked && !showOptions && (
        <div className="p-5 bg-white/[0.01] border border-white/5 text-center mb-4 transition-all relative group">
          <p className="text-[8px] text-[#df1b41] tracking-[0.3em] uppercase font-bold">Période de rétention active</p>
          <p className="text-[9px] text-zinc-500 mt-2 tracking-tight uppercase leading-relaxed font-mono">
            JUSQU'AU {availableDate}
          </p>
          <p className="text-[8px] text-zinc-600 mt-3 tracking-widest uppercase leading-loose border-t border-white/5 pt-3">
            Règles sur le marché secondaire :<br/>
            Blocage de 24 mois après sortie de manufacture.<br/>
            Blocage de 12 mois entre chaque revente.
          </p>
          {/* BOUTON CACHÉ DE TEST POUR DÉVELOPPEUR */}
          <button 
             onClick={() => setIsLocked(false)}
             className="absolute top-2 right-2 text-[6px] uppercase tracking-widest text-zinc-800 hover:text-white transition opacity-0 group-hover:opacity-100"
          >
             [Mode Dev: Ignorer]
          </button>
        </div>
      )}

      {!showOptions ? (
        <button 
          onClick={() => !isLocked && setShowOptions(true)}
          disabled={isLocked}
          className={`w-full py-5 text-[10px] tracking-[0.4em] uppercase transition-all duration-1000
            ${isLocked 
              ? 'bg-[#1a1a1a] text-zinc-600 border border-white/5 cursor-not-allowed' 
              : 'bg-transparent border border-[#d4bc8d] text-[#d4bc8d] hover:bg-[#d4bc8d] hover:text-black shadow-lg shadow-[#d4bc8d]/5 focus:outline-none'
            }`}
        >
          {isLocked ? "Revente indisponible" : "Demander une autorisation de revente"}
        </button>
      ) : (
        <div className="p-6 bg-[#0f0f0f] border border-white/10 space-y-6 animate-in slide-in-from-bottom-2">
          
          <div className="space-y-4">
            <h3 className="text-center text-[10px] tracking-[0.3em] uppercase text-zinc-400 mb-6">Mode de cession</h3>
            
            {/* OPTION BOUTIQUE */}
            <button 
                onClick={() => setSellMode('boutique')}
                className={`w-full p-4 border text-left transition-all ${sellMode === 'boutique' ? 'border-[#d4bc8d] bg-[#d4bc8d]/5' : 'border-white/5 hover:border-white/20 bg-transparent'}`}
            >
                <p className={`text-[10px] tracking-widest uppercase mb-1 font-bold ${sellMode === 'boutique' ? 'text-[#d4bc8d]' : 'text-zinc-300'}`}>Boutique Officielle</p>
                <p className="text-[8px] tracking-widest uppercase text-zinc-600 leading-relaxed">Confier la montre à Audemars Piguet pour une revente au prix du marché.</p>
            </button>

            {/* OPTION P2P */}
            <button 
                onClick={() => setSellMode('p2p')}
                className={`w-full p-4 border text-left transition-all ${sellMode === 'p2p' ? 'border-[#d4bc8d] bg-[#d4bc8d]/5' : 'border-white/5 hover:border-white/20 bg-transparent'}`}
            >
                <p className={`text-[10px] tracking-widest uppercase mb-1 font-bold ${sellMode === 'p2p' ? 'text-[#d4bc8d]' : 'text-zinc-300'}`}>Transmission Privée</p>
                <p className="text-[8px] tracking-widest uppercase text-zinc-600 leading-relaxed">Cession directe à un particulier identifié d'un commun accord.</p>
            </button>
          </div>

          {/* DÉTAILS SELON L'OPTION */}
          {sellMode === 'p2p' && (
             <div className="space-y-3 pt-4 border-t border-white/5 animate-in fade-in">
                <label className="text-[8px] text-zinc-500 uppercase tracking-[0.4em] block text-center">Identité du futur détenteur</label>
                <input 
                type="text"
                placeholder="Adresse Publique (0x...)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full bg-black border border-white/5 p-4 text-[11px] text-[#d4bc8d] font-mono text-center outline-none focus:border-[#d4bc8d]/50 transition-colors"
                />
            </div>
          )}

          {sellMode === 'boutique' && (
             <div className="pt-4 border-t border-white/5 animate-in fade-in text-center space-y-2">
                <p className="text-[8px] text-[#d4bc8d] uppercase tracking-widest">Frais de consignation AP: 15%</p>
                <p className="text-[7px] text-zinc-500 uppercase tracking-widest leading-relaxed">Une fois la demande acceptée, la montre sera affichée dans le catalogue principal de l'application et sécurisée dans un smart contract d'entiercement.</p>
             </div>
          )}

          {/* ACTIONS */}
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => { setShowOptions(false); setSellMode(null); }}
              className="flex-1 py-4 border border-white/5 text-[9px] tracking-[0.3em] uppercase text-zinc-500 hover:text-white transition"
            >
              Annuler
            </button>
            <button 
              onClick={handleRequestAuthorization}
              disabled={status === "loading" || !sellMode}
              className={`flex-[2] py-4 text-[9px] font-bold tracking-[0.3em] uppercase transition ${sellMode ? 'bg-[#d4bc8d] text-black hover:bg-[#c4ac7d]' : 'bg-white/5 text-zinc-600 cursor-not-allowed'}`}
            >
              {status === "loading" ? "Vérification..." : "Envoyer la demande"}
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
}