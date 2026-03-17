"use client";

import { usePrivy } from '@privy-io/react-auth';
import { useState } from 'react';
import { publicClient, LUXURY_WATCH_ADDRESS, luxuryWatchABI } from '@/config/contracts';

export default function Home() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [isScanning, setIsScanning] = useState(false);
  const [watchDetails, setWatchDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');

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
      const isOwner = userWallet?.toLowerCase() === ownerAddress.toLowerCase();

      setTimeout(() => {
        setWatchDetails({
          model: "Royal Oak",
          subModel: "Selfwinding Jumbo",
          reference: "16202ST.OO.1240ST.02",
          material: "Acier Inoxydable",
          dial: "Petite Tapisserie Bleue",
          caliber: "7121",
          isOwner
        });
        setIsScanning(false);
      }, 2500);
    } catch (e) {
      setIsScanning(false);
    }
  };

  if (!ready) return null;

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-[#ffffff] font-sans selection:bg-[#d4bc8d]/30">
      {/* BACKGROUND TEXTURE AP */}
      <div className="fixed inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }}>
      </div>

      {/* NAV BAR */}
      <nav className="relative z-10 p-6 flex justify-between items-center bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/5 sticky top-0">
        <div className="flex flex-col">
          <span className="text-lg tracking-[0.5em] font-bold">AUDEMARS PIGUET</span>
          <span className="text-[7px] tracking-[0.4em] text-[#d4bc8d] uppercase">Manufacture Le Brassus</span>
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
            <div className="space-y-4">
              <h1 className="text-6xl font-extralight tracking-tighter italic font-serif">Provenance</h1>
              <p className="text-[#d4bc8d] text-[10px] tracking-[0.5em] uppercase font-bold">The Digital Ledger</p>
            </div>
            <button 
              onClick={login}
              className="w-full py-6 bg-transparent border border-[#d4bc8d] text-[#d4bc8d] text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#d4bc8d] hover:text-black transition-all duration-700"
            >
              Identifier le propriétaire
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
            {!watchDetails ? (
              <div className="text-center py-24 space-y-12">
                <div className="relative mx-auto w-56 h-56 flex items-center justify-center">
                  {/* OCTOGONE ANIMÉ */}
                  <div className={`absolute inset-0 border-[0.5px] border-[#d4bc8d]/20 rotate-[22.5deg] transition-all duration-[3000ms] ${isScanning ? 'rotate-[202.5deg] scale-110' : ''}`}></div>
                  <div className="w-40 h-40 border border-[#d4bc8d] flex items-center justify-center relative overflow-hidden" 
                       style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}>
                    <div className={`text-[9px] tracking-[0.4em] text-[#d4bc8d] font-bold ${isScanning ? 'animate-pulse' : ''}`}>
                      {isScanning ? "READING..." : "READY"}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleNFCScan}
                  disabled={isScanning}
                  className="group flex flex-col items-center mx-auto space-y-4"
                >
                  <span className="text-[10px] tracking-[0.5em] text-zinc-500 group-hover:text-[#d4bc8d] transition">PRÉSENTER LA PIÈCE</span>
                  <div className="h-px w-12 bg-[#d4bc8d]/30 group-hover:w-20 transition-all duration-500"></div>
                </button>
              </div>
            ) : (
              <div className="animate-in fade-in duration-1000 space-y-8">
                {/* VISUEL MONTRE PREMIUM */}
                <div className="relative group bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] rounded-sm p-4 border border-white/5">
                  <img 
                    src="https://dynamicmedia.audemarspiguet.com/is/image/audemarspiguet/standup-638?fmt=avif-alpha&dpr=off" 
                    className="w-full h-72 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,1)] transition-transform duration-700 group-hover:scale-105"
                    alt="Royal Oak"
                  />
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 border border-white/10 rounded-full">
                    <span className="text-[8px] tracking-widest text-zinc-400 italic">ID #0000</span>
                  </div>
                </div>

                {/* TABS AP */}
                <div className="flex border-b border-white/5 gap-8">
                  <button onClick={() => setActiveTab('details')} className={`pb-4 text-[10px] tracking-[0.3em] uppercase transition-all ${activeTab === 'details' ? 'text-[#d4bc8d] border-b border-[#d4bc8d]' : 'text-zinc-600'}`}>DÉTAILS</button>
                  <button onClick={() => setActiveTab('history')} className={`pb-4 text-[10px] tracking-[0.3em] uppercase transition-all ${activeTab === 'history' ? 'text-[#d4bc8d] border-b border-[#d4bc8d]' : 'text-zinc-600'}`}>PROVENANCE</button>
                </div>

                {activeTab === 'details' ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-3xl font-light tracking-tighter uppercase">{watchDetails.model}</h2>
                        <p className="text-zinc-500 text-xs tracking-wide">{watchDetails.subModel}</p>
                      </div>
                      <span className="bg-[#d4bc8d]/10 text-[#d4bc8d] text-[9px] px-2 py-1 font-bold rounded-sm border border-[#d4bc8d]/20 tracking-tighter">CERTIFIÉ</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Référence', value: watchDetails.reference },
                        { label: 'Boîtier', value: watchDetails.material },
                        { label: 'Cadran', value: watchDetails.dial },
                        { label: 'Calibre', value: watchDetails.caliber },
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-sm">
                          <p className="text-[7px] uppercase text-zinc-600 mb-1 tracking-widest">{item.label}</p>
                          <p className="text-[10px] uppercase tracking-wider">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* ACTION : TRANSFERT */}
                    {watchDetails.isOwner && (
                      <button className="w-full py-5 bg-[#d4bc8d] text-black text-[10px] tracking-[0.3em] font-extrabold uppercase hover:brightness-110 transition mt-4">
                        Transférer la Propriété
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-4">
                       <div className="flex gap-4 items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
                          <div>
                            <p className="text-[10px] tracking-wider uppercase">Manufacture Le Brassus</p>
                            <p className="text-[8px] text-zinc-500 uppercase italic">Origine • Mars 2024</p>
                          </div>
                       </div>
                       <div className="h-8 w-px bg-white/10 ml-1"></div>
                       <div className="flex gap-4 items-center opacity-60">
                          <div className="w-2 h-2 rounded-full bg-[#d4bc8d]"></div>
                          <div>
                            <p className="text-[10px] tracking-wider uppercase">Propriétaire Actuel</p>
                            <p className="text-[8px] text-zinc-500 uppercase italic tracking-tighter">{user?.wallet?.address}</p>
                          </div>
                       </div>
                    </div>
                    <div className="p-4 border border-dashed border-white/10 rounded-sm text-center italic text-zinc-600 text-[9px]">
                      Fin du registre public
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER STATUTAIRE */}
      <footer className="fixed bottom-0 w-full p-8 flex justify-between items-end bg-gradient-to-t from-black to-transparent">
        <div className="flex flex-col gap-1">
          <span className="text-[7px] tracking-[0.4em] text-zinc-700 uppercase">Swiss Ledger ID</span>
        </div>
        <span className="text-[7px] tracking-[0.4em] text-zinc-700 uppercase">© {new Date().getFullYear()} Audemars Piguet</span>
      </footer>
    </main>
  );
}