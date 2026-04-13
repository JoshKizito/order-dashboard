# 📦 Order Dashboard

Mini tableau de bord de commandes avec RetailCRM, Supabase et notifications Telegram.

## 🧰 Stack technique

| Couche      | Technologie            |
|-------------|------------------------|
| Backend     | Node.js + Express      |
| Frontend    | Next.js (React)        |
| Base de données | Supabase (PostgreSQL) |
| Déploiement | Vercel                 |
| APIs        | RetailCRM, Telegram    |

---

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone <your-repo-url>
cd order-dashboard
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
# Remplir les valeurs dans .env
```

### 3. Installer le backend

```bash
cd backend
npm install
```

### 4. Installer le frontend

```bash
cd ../frontend
npm install
```

---

## 🗄️ Initialiser Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor**
3. Copier-coller le contenu de `supabase/schema.sql` et exécuter

---

## 📤 Uploader les commandes mock vers RetailCRM

```bash
cd backend
node scripts/upload-orders.js
```

---

## 🔄 Synchroniser RetailCRM → Supabase

```bash
cd backend
node scripts/sync-orders.js
```

---

## ▶️ Lancer le projet en local

### Backend (port 4000)

```bash
cd backend
node server.js
```

### Frontend (port 3000)

```bash
cd frontend
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🌐 Déploiement sur Vercel

1. Push sur GitHub
2. Importer le projet sur [vercel.com](https://vercel.com)
3. Pour le **frontend** : pointer sur le dossier `/frontend`
4. Ajouter toutes les variables d'environnement dans Vercel

---

## 🤖 Bot Telegram

Le bot envoie automatiquement une notification quand une commande dépasse **50 000 ₸**.

Pour créer un bot Telegram :
1. Parler à [@BotFather](https://t.me/BotFather) sur Telegram
2. Créer un bot avec `/newbot`
3. Copier le token dans `.env`
4. Obtenir votre `CHAT_ID` via `https://api.telegram.org/bot<TOKEN>/getUpdates`

---

## 📁 Structure du projet

```
order-dashboard/
├── README.md
├── .env.example
├── backend/
│   ├── server.js          ← Serveur Express principal
│   ├── routes/orders.js   ← Routes API
│   ├── services/
│   │   ├── retailcrm.js   ← Client RetailCRM
│   │   ├── supabase.js    ← Client Supabase
│   │   └── telegram.js    ← Notifications Telegram
│   └── scripts/
│       ├── mock_orders.json   ← 50 commandes de test
│       ├── upload-orders.js   ← Upload vers RetailCRM
│       └── sync-orders.js     ← Sync RetailCRM → Supabase
├── frontend/
│   ├── pages/index.js     ← Dashboard principal
│   ├── components/
│   │   ├── StatsCard.js   ← Carte statistique
│   │   └── OrdersChart.js ← Graphique des commandes
│   └── styles/globals.css
└── supabase/
    └── schema.sql         ← Schéma de la table orders
```
