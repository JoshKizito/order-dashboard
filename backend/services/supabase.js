// =============================================
// services/supabase.js — Client Supabase
// =============================================

const { createClient } = require('@supabase/supabase-js');

// Initialisation du client Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/**
 * Transforme une commande RetailCRM au format de notre table Supabase.
 * RetailCRM retourne des objets complexes ; on extrait seulement ce dont on a besoin.
 *
 * @param {Object} crmOrder - Commande brute venant de RetailCRM
 * @returns {Object} Commande formatée pour Supabase
 */
function formatOrder(crmOrder) {
  return {
    id:             String(crmOrder.id),
    number:         crmOrder.number || `ORD-${crmOrder.id}`,
    status:         crmOrder.status || 'new',
    total_sum:      parseFloat(crmOrder.totalSumm || crmOrder.summ || 0),
    customer_name:  crmOrder.firstName
                      ? `${crmOrder.firstName} ${crmOrder.lastName || ''}`.trim()
                      : 'Client inconnu',
    customer_email: crmOrder.email || null,
    customer_phone: crmOrder.phone || null,
    created_at:     crmOrder.createdAt || new Date().toISOString(),
  };
}

/**
 * Insère ou met à jour une liste de commandes dans Supabase.
 * "Upsert" = INSERT si n'existe pas, UPDATE si existe déjà (basé sur l'id).
 *
 * @param {Array} crmOrders - Commandes venant de RetailCRM
 * @returns {Array} Commandes insérées/mises à jour
 */
async function upsertOrders(crmOrders) {
  // Transformer toutes les commandes au bon format
  const formatted = crmOrders.map(formatOrder);

  const { data, error } = await supabase
    .from('orders')
    .upsert(formatted, { onConflict: 'id' }) // Mise à jour si l'id existe déjà
    .select();

  if (error) throw new Error(`Supabase upsert error: ${error.message}`);

  return data;
}

/**
 * Récupère toutes les commandes depuis Supabase, triées par date décroissante.
 *
 * @returns {Array} Liste des commandes
 */
async function getAllOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Supabase fetch error: ${error.message}`);

  return data;
}

/**
 * Calcule les statistiques globales.
 *
 * @returns {Object} { totalOrders, totalRevenue }
 */
async function getStats() {
  const { data, error } = await supabase
    .from('orders')
    .select('total_sum');

  if (error) throw new Error(`Supabase stats error: ${error.message}`);

  const totalOrders  = data.length;
  const totalRevenue = data.reduce((sum, o) => sum + Number(o.total_sum), 0);

  return { totalOrders, totalRevenue };
}

/**
 * Retourne le nombre de commandes et le revenu groupés par jour.
 * Utilisé pour afficher le graphique dans le dashboard.
 *
 * @returns {Array} [{ date: "2024-01-15", count: 3, revenue: 120000 }, ...]
 */
async function getOrdersByDate() {
  const { data, error } = await supabase
    .from('orders')
    .select('created_at, total_sum')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Supabase by-date error: ${error.message}`);

  // Grouper manuellement par date (YYYY-MM-DD)
  const grouped = {};

  for (const order of data) {
    const date = order.created_at.substring(0, 10); // "2024-01-15"

    if (!grouped[date]) {
      grouped[date] = { date, count: 0, revenue: 0 };
    }

    grouped[date].count   += 1;
    grouped[date].revenue += Number(order.total_sum);
  }

  return Object.values(grouped);
}

module.exports = { upsertOrders, getAllOrders, getStats, getOrdersByDate };
