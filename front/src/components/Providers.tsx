"use client";

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "VOTRE_APP_ID_PRIVY"}
      config={{
        loginMethods: ['email', 'apple', 'google'], // Apple gère FaceID/TouchID via Passkeys
        appearance: {
          theme: 'dark', // Parfait pour le luxe
          accentColor: '#D4AF37', // Doré
          logo: 'https://votre-logo.com/logo.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets', // type might be ignored, left as is to not break existing flow if using older Privy
        },
        // Configuration ERC-4337 (Smart Wallets pour le Gasless via paymaster)
        smartWallets: {
          createOnLogin: true,
          requireSmartWallet: false, // <-- Mis sur false pour ne pas bloquer la connexion si non activé sur le dashboard
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}