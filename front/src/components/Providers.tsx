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
          createOnLogin: 'users-without-wallets', // Crée le wallet web3 invisible automatiquement !
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}