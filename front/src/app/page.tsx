"use client";

import { jsPDF } from "jspdf";
import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import { publicClient, LUXURY_WATCH_ADDRESS, luxuryWatchABI } from '@/config/contracts';
import TransferModule from '@/components/TransferModule';
import Marketplace from '@/components/Marketplace';

export default function Home() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [isScanning, setIsScanning] = useState(false);
  const [watchDetails, setWatchDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'warranty'>('details');
  const [appMode, setAppMode] = useState<'coffre' | 'boutique'>('coffre');

  const handleNFCScan = async () => {
    setIsScanning(true);
    try {
      const tokenId = 0n;
      const ownerAddress = await publicClient.readContract({
        address: LUXURY_WATCH_ADDRESS as `0x${string}`,
        abi: luxuryWatchABI,
        functionName: 'ownerOf',
        args: [tokenId],
      }) as string;

      const userWallet = user?.wallet?.address;
      // Pour le mode démo, on considère que si on a scanné la montre, on est le propriétaire
      const isOwner = true; // userWallet?.toLowerCase() === ownerAddress.toLowerCase();

      setTimeout(() => {
        setWatchDetails({
          model: "Royal Oak",
          subModel: "Selfwinding Jumbo",
          reference: "16202ST.OO.1240ST.02",
          material: "Acier Inoxydable",
          dial: "Petite Tapisserie Bleue",
          caliber: "7121",
          warrantyUntil: "17 Mars 2029",
          isOwner
        });
        setIsScanning(false);
      }, 2500);
    } catch (e) {
      setIsScanning(false);
    }
  };

  if (!ready) return null;

  const generateCertificate = () => {
      if (!watchDetails) return;

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const gold = [212, 188, 141];
      const black = [15, 15, 15];
      const gray = [120, 120, 120];

      // 1. Fond et Bordures
      doc.setFillColor(black[0], black[1], black[2]);
      doc.rect(0, 0, 210, 297, "F");
      doc.setDrawColor(gold[0], gold[1], gold[2]);
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 277, "S");

      // 2. Header (Position fixe à 105mm pour le centre)
      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("AUDEMARS PIGUET", 105, 45, { align: "center" }); // [cite: 1]
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("MANUFACTURE LE BRASSUS, SUISSE", 105, 52, { align: "center" }); // [cite: 2, 3, 4]

      doc.setLineWidth(0.2);
      doc.line(85, 60, 125, 60);

      // 3. Titre
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text("CERTIFICAT D'AUTHENTICITE NUMERIQUE", 105, 80, { align: "center" }); // [cite: 5]

      // 4. Grille de Données (X et Y fixes, sans options d'espacement)
      const startY = 110;
      
      // Libellés (Gris)
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.setFontSize(8);
      doc.text("MODELE", 105, startY, { align: "center" }); // [cite: 6]
      doc.text("REFERENCE", 105, startY + 25, { align: "center" }); // [cite: 8]
      doc.text("CALIBRE", 105, startY + 50, { align: "center" }); // [cite: 10]
      doc.text("GARANTIE MANUFACTURE", 105, startY + 75, { align: "center" }); // [cite: 12]

      // Valeurs (Blanc)
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text(watchDetails.model.toUpperCase(), 105, startY + 8, { align: "center" }); // [cite: 7]
      doc.text(watchDetails.reference, 105, startY + 33, { align: "center" }); // [cite: 9]
      doc.text(watchDetails.caliber, 105, startY + 58, { align: "center" }); // [cite: 11]
      doc.text(`VALIDE JUSQU'AU ${watchDetails.warrantyUntil.toUpperCase()}`, 105, startY + 83, { align: "center" }); // [cite: 13]

      // 5. Bloc Propriétaire
      doc.setFillColor(25, 25, 25);
      doc.rect(30, 215, 150, 20, "F");
      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.setFontSize(7);
      doc.text("IDENTIFIANT PROPRIETAIRE (BLOCKCHAIN)", 105, 221, { align: "center" }); // [cite: 14]
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(user?.wallet?.address || "NON VERIFIE", 105, 229, { align: "center" }); // [cite: 15]

      // 6. Footer
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.setFontSize(6);
      doc.text("Ce document est une preuve de propriete immuable sur le reseau Ethereum Sepolia.", 105, 260, { align: "center" }); // 
      doc.text(`Smart Contract : ${LUXURY_WATCH_ADDRESS}`, 105, 265, { align: "center" }); // [cite: 17]

      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.setFontSize(20);
      doc.text("AP", 105, 280, { align: "center" }); // [cite: 18]

      doc.save(`AP_Certificat_${watchDetails.reference}.pdf`);
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-[#ffffff] font-sans selection:bg-[#d4bc8d]/30">
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }}>
      </div>

      <nav className="relative z-10 p-6 flex justify-between items-center bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/5 sticky top-0">
        <div className="flex flex-col">
          <span className="text-lg tracking-[0.5em] font-bold uppercase leading-none">Audemars Piguet</span>
          <span className="text-[7px] tracking-[0.4em] text-[#d4bc8d] uppercase mt-1">Manufacture Le Brassus</span>
        </div>
        {authenticated && (
          <button onClick={logout} className="p-2 border border-white/10 rounded-full hover:bg-white/5 transition">
             <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-500"><path d="M3 1H10V2H3V13H10V14H3C2.44772 14 2 13.5523 2 13V2C2 1.44772 2.44772 1 3 1Z" fill="currentColor"/><path d="M10.4697 4.46967L13.5303 7.53033L10.4697 10.591L9.40901 9.53033L10.909 8.03033L5 8.03033V6.96967L10.909 6.96967L9.40901 5.46967L10.4697 4.46967Z" fill="currentColor"/></svg>
          </button>
        )}
      </nav>

      <div className="relative z-10 max-w-md mx-auto px-6 pt-10 pb-32">
        {!authenticated ? (
          <div className="text-center space-y-16 py-20 animate-in fade-in duration-1000">
            <div className="space-y-4 text-center flex flex-col items-center">
              <h1 className="text-6xl font-extralight tracking-tighter italic font-serif">Provenance</h1>
              <div className="h-px w-16 bg-[#d4bc8d] opacity-50 mt-4"></div>
            </div>
            <button onClick={login} className="w-full py-6 bg-transparent border border-[#d4bc8d] text-[#d4bc8d] text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#d4bc8d] hover:text-black transition-all duration-700">
              Identifier le propriétaire
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            <div className="flex border-b border-white/5 justify-between">
              <button onClick={() => setAppMode('coffre')} className={`pb-4 text-[9px] tracking-[0.2em] uppercase transition-all ${appMode === 'coffre' ? 'text-[#d4bc8d] border-b border-[#d4bc8d]' : 'text-zinc-600'}`}>Mon Coffre</button>
              <button onClick={() => setAppMode('boutique')} className={`pb-4 text-[9px] tracking-[0.2em] uppercase transition-all ${appMode === 'boutique' ? 'text-[#d4bc8d] border-b border-[#d4bc8d]' : 'text-zinc-600'}`}>Boutique</button>
            </div>

            {appMode === 'boutique' ? (
              <Marketplace />
            ) : !watchDetails ? (
              <div className="text-center py-24 space-y-12">
                <div className="relative mx-auto w-56 h-56 flex items-center justify-center">
                  <div className={`absolute inset-0 border-[0.5px] border-[#d4bc8d]/20 rotate-[22.5deg] transition-all duration-[3000ms] ${isScanning ? 'rotate-[202.5deg] scale-110' : ''}`}></div>
                  <div className="w-40 h-40 border border-[#d4bc8d] flex items-center justify-center relative overflow-hidden" 
                       style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}>
                    <div className={`text-[9px] tracking-[0.4em] text-[#d4bc8d] font-bold ${isScanning ? 'animate-pulse' : ''}`}>
                      {isScanning ? "READING..." : "READY"}
                    </div>
                  </div>
                </div>
                <button onClick={handleNFCScan} disabled={isScanning} className="group flex flex-col items-center mx-auto space-y-4 transition-all">
                  <span className="text-[10px] tracking-[0.5em] text-zinc-500 group-hover:text-[#d4bc8d] transition uppercase">Présenter la pièce</span>
                  <div className="h-px w-12 bg-[#d4bc8d]/30 group-hover:w-24 transition-all duration-700"></div>
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-1000 space-y-8">
                <div className="relative group bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-sm p-4 border border-white/5">
                  <img src="https://dynamicmedia.audemarspiguet.com/is/image/audemarspiguet/standup-638?fmt=avif-alpha&dpr=off" className="w-full h-64 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,1)] transition-transform duration-700 group-hover:scale-105" alt="Royal Oak" />
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full">
                    <span className="text-[8px] tracking-widest text-zinc-400 italic font-mono">ID #0000</span>
                  </div>
                </div>

                <div className="flex border-b border-white/5 justify-between">
                  <button onClick={() => setActiveTab('details')} className={`pb-4 text-[9px] tracking-[0.2em] uppercase transition-all ${activeTab === 'details' ? 'text-[#d4bc8d] border-b border-[#d4bc8d]' : 'text-zinc-600'}`}>Détails</button>
                  <button onClick={() => setActiveTab('history')} className={`pb-4 text-[9px] tracking-[0.2em] uppercase transition-all ${activeTab === 'history' ? 'text-[#d4bc8d] border-b border-[#d4bc8d]' : 'text-zinc-600'}`}>Provenance</button>
                  <button onClick={() => setActiveTab('warranty')} className={`pb-4 text-[9px] tracking-[0.2em] uppercase transition-all ${activeTab === 'warranty' ? 'text-[#d4bc8d] border-b border-[#d4bc8d]' : 'text-zinc-600'}`}>Garantie</button>
                </div>

                {activeTab === 'details' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div>
                      <h2 className="text-3xl font-light tracking-tighter uppercase leading-none">{watchDetails.model}</h2>
                      <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-2">{watchDetails.subModel}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Référence', value: watchDetails.reference },
                        { label: 'Boîtier', value: watchDetails.material },
                        { label: 'Cadran', value: watchDetails.dial },
                        { label: 'Calibre', value: watchDetails.caliber },
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                          <p className="text-[7px] uppercase text-zinc-600 mb-1 tracking-[0.2em]">{item.label}</p>
                          <p className="text-[10px] uppercase tracking-wider leading-tight">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 py-4">
                    <div className="relative pl-8 space-y-12">
                      <div className="absolute left-[3px] top-2 bottom-2 w-px bg-white/10"></div>
                      <div className="relative">
                        {/* PAST STATE: Zinc or Gold without the intense glow */}
                        <div className="absolute -left-[32px] top-1 w-2 h-2 rounded-full bg-zinc-600"></div>
                        <p className="text-[10px] tracking-wider uppercase font-bold text-white">Manufacture Le Brassus</p>
                        <p className="text-[8px] text-zinc-500 uppercase mt-1 tracking-widest">Origine • Mars 2024</p>
                      </div>
                      <div className="relative">
                        {/* CURRENT STATE: Green LED */}
                        <div className="absolute -left-[32px] top-1 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                        <p className="text-[10px] tracking-wider uppercase font-bold text-white">Acquisition Certifiée</p>
                        <p className="text-[8px] text-zinc-500 uppercase mt-1 tracking-widest leading-relaxed">
                          Propriétaire Actuel: {user?.wallet?.address?.slice(0,18)}...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'warranty' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-[#d4bc8d]/20 rounded-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-10">
                        <span className="text-4xl tracking-tighter italic font-serif text-[#d4bc8d]">AP</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-500">Statut de la pièce</p>
                        <p className="text-xl tracking-widest uppercase font-light">Sous Garantie</p>
                      </div>
                      <div className="mt-8 flex justify-between items-end border-t border-white/5 pt-6">
                        <div>
                          <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Date d'expiration</p>
                          <p className="text-xs text-[#d4bc8d] tracking-widest uppercase">{watchDetails.warrantyUntil}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Couverture</p>
                          <p className="text-xs tracking-widest uppercase">Mondiale</p>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={generateCertificate}
                      className="w-full py-5 border border-[#d4bc8d]/40 text-[#d4bc8d] text-[9px] tracking-[0.4em] uppercase hover:bg-[#d4bc8d]/10 transition flex items-center justify-center gap-2"
                    >
                      <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80"><path d="M1 2C0.447715 2 0 2.44772 0 3V12C0 12.5523 0.447715 13 1 13H14C14.5523 13 15 12.5523 15 12V3C15 2.44772 14.5523 2 14 2H1ZM1 3H14V12H1V3ZM3 5V6H12V5H3ZM3 7V8H12V7H3ZM3 9V10H8V9H3Z" fill="currentColor"/></svg>
                      Générer le certificat numérique
                    </button>
                  </div>
                )}

                {/* ACTION PRIMAIRE */}
                {watchDetails.isOwner && activeTab === 'details' && (
                  <TransferModule 
                    watchDetails={watchDetails}
                    userWallet={user?.wallet?.address}
                    onTransferSuccess={() => {
                      setWatchDetails(null); // On "perd" la vue de la montre car elle n'est plus à nous
                      alert("La montre a été retirée de votre coffre numérique.");
                    }}
                  />
                )}
              </div>
            )}
            {/* FIN DU SWITCH COFFRE/BOUTIQUE */}
            {appMode === 'coffre' ? '' : ''}
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 w-full p-8 flex justify-between items-end bg-gradient-to-t from-black to-transparent pointer-events-none">
        <div className="flex flex-col gap-1">
          <span className="text-[7px] tracking-[0.5em] text-zinc-700 uppercase">Swiss Ledger ID</span>
          <span className="text-[9px] text-[#d4bc8d] font-mono tracking-tighter opacity-50">0xAP...7121</span>
        </div>
        <span className="text-[7px] tracking-[0.5em] text-zinc-700 uppercase opacity-30">© 2026 Audemars Piguet</span>
      </footer>
    </main>
  );
}