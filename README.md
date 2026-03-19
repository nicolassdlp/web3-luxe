# Web3 & Luxe | Audemars Piguet
### Système de Passeport Numérique Phygital & Marketplace D2C (Direct-to-Consumer)

Ce projet implémente une solution de Passeport Numérique de Produit pour la manufacture Audemars Piguet. Il vise à sécuriser l'authenticité, éradiquer la contrefaçon ("superfakes") et réguler le marché gris grâce à la technologie Blockchain.

---

## Vision Stratégique
L'objectif est d'associer chaque montre physique à une identité numérique unique, infalsifiable et traçable.
* **Lutte contre le Marché Gris** : Programmation de règles anti-spéculation directement dans le Smart Contract pour limiter la revente sauvage.
* **Expérience Invisible** : Utilisation de l'**Account Abstraction (ERC-4337)** pour supprimer la complexité technique (pas de phrases de récupération, pas de frais de gaz pour le client).
* **Pérennité** : Stockage décentralisé des données sur **IPFS** pour garantir que le certificat survit aux serveurs de l'entreprise.

---

## Architecture Technique

### Smart Contracts (Solidity)
1.  **`LuxuryWatch.sol` (ERC-721)** : Le registre principal des montres.
    * **Time-lock de 2 ans** : Transfert de propriété interdit durant les 24 premiers mois suivant l'achat.
    * **Cooldown de 1 an** : Un seul transfert autorisé par an après le verrouillage initial.
2.  **`WatchHistory.sol` (ERC-5192)** : Certificats d'entretien **Soulbound** (non-transférables) pour une traçabilité complète des réparations.
3.  **`LuxuryMarketplace.sol`** : Contrat de vente directe permettant le "mint" (création) automatique du certificat lors de l'achat en boutique ou en ligne.

### Stack Technologique
* **Framework** : Foundry (Forge).
* **Account Abstraction** : ZeroDev / Pimlico (Standard ERC-4337).
* **Stockage** : IPFS (Décentralisé).
* **Réseau** : Ethereum Sepolia Testnet.
* **Identification** : Puce NFC sécurisée avec identifiant unique.

---

## Installation et Utilisation

### Pré-requis
- Node.js (v18+) & npm  
- Foundry (Forge, Cast, Anvil)  
- Extension Web3 (ex : MetaMask)  
- Compte Alchemy (RPC Sepolia)  
- Compte Privy (authentification biométrique)

### 1. Clonez le repo GitHub :
```bash
git clone https://github.com/nicolassdlp/web3-luxe.git
```

### 2. Configuration des variables d'environnement (.env)

Pour que l'authentification et le paiement "Gasless" fonctionnent, vous devez configurer le fichiers `.env` ainsi que le fichier `.env.local` dans le dossier `front`. 

**Dans le dossier racine (Blockchain) :**
Créez un fichier `.env` et remplissez :
```bash
PRIVATE_KEY=votre_cle_privee_sepolia
SEPOLIA_RPC_URL=votre_url_alchemy_ou_infura
ETHERSCAN_API_KEY=votre_cle_etherscan
```
**Dans le dossier front :**
Créez un fichier `.env.local` et remplissez :
```bash
NEXT_PUBLIC_PRIVY_APP_ID=votre_cle_privee_sepolia
PRIVY_APP_SECRET=votre_cle_privee_sepolia
NEXT_PUBLIC_ALCHEMY_RPC_URL=votre_url_alchemy_public
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=votre_cle_public_stripe
STRIPE_SECRET_KEY=votre_cle_privee_stripe
```

### 3. Installez Foundry : 
```bash
curl -L https://foundry.paradigm.xyz | bash
```
### 4. Effectuez le build : 
```bash
$ forge build
```
### 5. Effectuez cette commande : 
```bash
cd front
```
### 6. Installez les dépendances : 
```bash
npm install
```
### 7. Lancez le serveur : 
```bash
npm run dev
```
### 8. Ouvrez votre navigateur et accédez à cet url :
```bash
http://localhost:3000
```