// =============================================
// routes/orders.js — Routes API pour les commandes
// =============================================

const express      = require('express');
const router       = express.Router();
const supabaseService = require('../services/supabase');

// GET /api/orders
// Retourne toutes les commandes stockées dans Supabase
router.get('/', async (req, res) => {
  try {
    const orders = await supabaseService.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Erreur GET /api/orders :', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/stats
// Retourne les statistiques : total commandes, revenu total
router.get('/stats', async (req, res) => {
  try {
    const stats = await supabaseService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Erreur GET /api/orders/stats :', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/orders/by-date
// Retourne le nombre de commandes groupées par jour (pour le graphique)
router.get('/by-date', async (req, res) => {
  try {
    const byDate = await supabaseService.getOrdersByDate();
    res.json({ success: true, data: byDate });
  } catch (error) {
    console.error('Erreur GET /api/orders/by-date :', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
