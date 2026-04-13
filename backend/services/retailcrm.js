// =============================================
// services/retailcrm.js — Client RetailCRM
// =============================================

const axios = require('axios');

// Les identifiants viennent des variables d'environnement
const BASE_URL = process.env.RETAILCRM_URL;
const API_KEY  = process.env.RETAILCRM_API_KEY;

// Vérifie que les variables sont bien définies
if (!BASE_URL || !API_KEY) {
  console.warn('⚠️  RETAILCRM_URL ou RETAILCRM_API_KEY manquant dans .env');
}

// Client Axios préconfiguré pour RetailCRM
const client = axios.create({
  baseURL: `${BASE_URL}/api/v5`,
  params: { apiKey: API_KEY }, // La clé API est ajoutée à chaque requête
  timeout: 10000,              // Timeout de 10 secondes
});

/**
 * Récupère toutes les commandes depuis RetailCRM.
 * RetailCRM utilise la pagination (par défaut 20 par page).
 * Cette fonction récupère TOUTES les pages automatiquement.
 *
 * @returns {Array} Liste de toutes les commandes
 */
async function fetchAllOrders() {
  let allOrders = [];
  let page      = 1;
  let totalPages = 1;

  console.log('📡 Récupération des commandes depuis RetailCRM...');

  do {
    const response = await client.get('/orders', {
      params: {
        page,
        limit: 50, // Maximum autorisé par RetailCRM
        filter: { sites: [] }, // Pas de filtre par site
      },
    });

    const { orders, pagination } = response.data;

    allOrders  = allOrders.concat(orders || []);
    totalPages = pagination?.totalPageCount || 1;

    console.log(`  → Page ${page}/${totalPages} : ${orders?.length || 0} commandes`);
    page++;

  } while (page <= totalPages);

  console.log(`✅ Total récupéré : ${allOrders.length} commandes`);
  return allOrders;
}

/**
 * Crée une commande dans RetailCRM.
 *
 * @param {Object} order - Données de la commande (format RetailCRM)
 * @returns {Object} Réponse de l'API
 */
async function createOrder(order) {
  const response = await client.post('/orders', {
    order: JSON.stringify(order),
  });
  return response.data;
}

module.exports = { fetchAllOrders, createOrder };
