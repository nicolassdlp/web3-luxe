"use client";

import { useState, useEffect } from 'react';
import { publicClient, LUXURY_WATCH_ADDRESS, luxuryWatchABI } from '@/config/contracts';

interface TransferModuleProps {
  watchDetails: any;
  userWallet: string | undefined;
  onTransferSuccess: () => void;
}

export default function TransferModule({ watchDetails, userWallet, onTransferSuccess }: TransferModuleProps) {
  const [showForm, setShowForm] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  const [isLocked, setIsLocked] = useState(false);
  const [availableDate, setAvailableDate] = useState<string>("");

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
        }
      } catch (e) {
        console.error("Erreur lecture registre:", e);
      }
    };
    checkLockStatus();
  }, []);

  const handleTransfer = async () => {
    if (!recipient.startsWith('0x') || recipient.length !== 42) {
      alert("Veuillez renseigner une identité numérique valide.");
      return;
    }
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        onTransferSuccess();
      }, 2000);
    }, 3000);
  };

  if (status === "success") {
    return (
      <div className="p-6 border border-[#d4bc8d]/30 bg-white/[0.02] text-center animate-in fade-in duration-500">
        <p className="text-[10px] text-[#d4bc8d] tracking-[0.3em] font-bold uppercase">Transmission Terminée</p>
        <p className="text-[8px] text-zinc-500 mt-2 uppercase italic tracking-tighter">
          Le registre de la Manufacture a été mis à jour avec succès.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {/* INFORMATION SUR LA DÉTENTION (DISCRET ET SOBRE) */}
      {isLocked && !showForm && (
        <div className="p-5 bg-white/[0.01] border border-white/5 text-center mb-4 transition-all">
          <p className="text-[8px] text-[#d4bc8d] tracking-[0.3em] uppercase font-bold">Pièce en période de rétention</p>
          <p className="text-[9px] text-zinc-500 mt-2 tracking-tight uppercase leading-relaxed">
            Afin de préserver l'exclusivité de cette pièce, la transmission sera disponible à partir du <span className="text-zinc-300 italic">{availableDate}</span>.
          </p>
        </div>
      )}

      {!showForm ? (
        <button 
          onClick={() => !isLocked && setShowForm(true)}
          disabled={isLocked}
          className={`w-full py-5 text-[10px] tracking-[0.4em] font-extrabold uppercase transition-all duration-1000
            ${isLocked 
              ? 'bg-zinc-900/50 text-zinc-700 border border-white/5 cursor-default' 
              : 'bg-[#d4bc8d] text-black hover:bg-[#c4ac7d] shadow-lg shadow-[#d4bc8d]/5'
            }`}
        >
          {isLocked ? "Transmission indisponible" : "Transmettre la propriété"}
        </button>
      ) : (
        <div className="p-6 bg-white/[0.02] border border-[#d4bc8d]/20 rounded-sm space-y-6 animate-in slide-in-from-bottom-2">
          <div className="space-y-3 text-center">
            <label className="text-[8px] text-zinc-500 uppercase tracking-[0.4em]">Identité du futur détenteur</label>
            <input 
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full bg-black border border-white/5 p-4 text-[11px] text-[#d4bc8d] font-mono text-center outline-none focus:border-[#d4bc8d]/30 transition-colors"
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowForm(false)}
              className="flex-1 py-4 border border-white/5 text-[9px] tracking-[0.3em] uppercase text-zinc-500 hover:text-white transition"
            >
              Retour
            </button>
            <button 
              onClick={handleTransfer}
              disabled={status === "loading"}
              className="flex-1 py-4 bg-[#d4bc8d] text-black text-[9px] font-bold tracking-[0.3em] uppercase disabled:opacity-50"
            >
              {status === "loading" ? "Sécurisation..." : "Confirmer"}
            </button>
          </div>
          
          <div className="pt-2 border-t border-white/5">
             <p className="text-[7px] text-zinc-600 text-center leading-relaxed uppercase tracking-[0.1em]">
              Note : Cette action est irrévocable. <br/>
              Le nouveau détenteur bénéficiera d'une période de protection d'un an avant toute nouvelle transmission.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}