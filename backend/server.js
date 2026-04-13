// =============================================
// server.js — Serveur Express principal
// =============================================

require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const ordersRouter = require('./routes/orders');

const app  = express();
const PORT = process.env.PORT || 4000;

// --- Middlewares ---
// Autoriser les requêtes depuis le frontend Next.js
app.use(cors());

// Parser le JSON dans les requêtes entrantes
app.use(express.json());

// --- Routes ---
app.use('/api/orders', ordersRouter);

// Route de santé (pour vérifier que le serveur fonctionne)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Démarrage ---
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
