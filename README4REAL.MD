# ⌚️ Passeport Numérique  
## Maison de Haute Horlogerie (Web3 & Luxe)

Bienvenue sur le dépôt du projet de **Passeport Numérique de Produit (DPP)** dédié à l'industrie de la Haute Horlogerie.

Ce projet relie le monde physique et numérique en associant :

- 🕰️ Une **montre de luxe** (équipée d'une puce NFC sécurisée)  
- 🔗 Un **certificat d'authenticité immuable** sur la blockchain Ethereum (Sepolia)

🎯 **Objectif :** offrir une expérience utilisateur **sans friction (Web2.5)**  
→ La blockchain est totalement invisible grâce à **Account Abstraction**  
→ Connexion simple via **Email ou FaceID / Biométrie**

---

# 🏗 Architecture du Projet

Le projet est divisé en deux parties principales :

## 🔹 Smart Contracts (/src & /script)
Développés avec **Foundry** et **Solidity**

- 📜 Standard **ERC721**
- ⚙️ Logique métier :
  - 🔒 Blocage des transferts pendant **2 ans après l'achat**
  - ⏳ Cooldown de **1 an entre chaque transfert secondaire**

---

## 🔹 Interface Front-end (/front)
Développée avec :

- ⚛️ Next.js  
- 🎨 TailwindCSS  
- 🔌 Viem (communication blockchain)  
- 🔐 Privy (Wallet-as-a-Service / Account Abstraction)

---

# 🛠 Prérequis

Avant de commencer, installez :

- Node.js (v18+) & npm  
- Foundry (Forge, Cast, Anvil)  
- Extension Web3 (ex : MetaMask)  
- Compte Alchemy (RPC Sepolia)  
- Compte Privy (authentification biométrique)

---

# 🚀 Guide d'Installation (From Scratch)

## 📦 Étape 1 : Récupération du projet

git clone URL_DE_VOTRE_REPO  
cd web3-luxe  
cd front && npm install && cd ..

---

## 🔗 Étape 2 : Configuration Blockchain

Créer un fichier `.env` :

SEPOLIA_RPC_URL=votre_url_alchemy  
PRIVATE_KEY=votre_cle_privee  

---

## 🚀 Étape 3 : Déploiement

source .env && forge script script/DeployLuxuryWatch.s.sol:DeployLuxuryWatch --rpc-url \$SEPOLIA_RPC_URL --broadcast

---

## 🎨 Étape 4 : Front-end

Dans votre Dashboard Privy : allez dans Configuration > App Settings, et activez l'option 'Automatically create embedded wallets on login' pour les wallets EVM.

⚠️ Important : Copiez l'adresse du contrat affichée dans votre terminal et collez-la dans le fichier front/src/config/contracts.ts à la variable LUXURY_WATCH_ADDRESS.

Configurer `/front/.env.local` :

NEXT_PUBLIC_PRIVY_APP_ID=votre_id_privy  
NEXT_PUBLIC_ALCHEMY_RPC_URL=votre_url_alchemy  

Lancer :

cd front  
npm run dev  

---

## ✨ Étape 5 : Test

Pour obtenir l'adresse client : connectez-vous sur l'interface (localhost:3000), copiez l'adresse dorée qui apparaît sous 'Identité Sécurisée', et utilisez-la dans la commande cast ci-dessous.

Mint :

cast send ADRESSE_CONTRAT "safeMint(address,string)" "ADRESSE_CLIENT_PRIVY" "ipfs://Metadata" --rpc-url \$SEPOLIA_RPC_URL --private-key \$PRIVATE_KEY

---

# 🔒 Sécurité

⚠️ Ne commitez jamais vos fichiers `.env`

---

# 💎 Vision

- 🕰️ Luxe  
- 🔗 Blockchain  
- 📱 UX simplifiée  

