// =============================================
// scripts/sync-orders.js
// Synchronisation RetailCRM → Supabase + alertes Telegram
//
// Usage : node scripts/sync-orders.js
// =============================================

require('dotenv').config({ path: '../.env' });

const retailcrm = require('../services/retailcrm');
const supabase  = require('../services/supabase');
const telegram  = require('../services/telegram');

/**
 * Fonction principale de synchronisation.
 *
 * Étapes :
 * 1. Récupère toutes les commandes depuis RetailCRM
 * 2. Les insère/met à jour dans Supabase
 * 3. Envoie une alerte Telegram pour les commandes > 50 000 ₸
 */
async function sync() {
  console.log('🔄 Début de la synchronisation RetailCRM → Supabase');
  console.log(`📅 ${new Date().toLocaleString('fr-FR')}\n`);

  // --- Étape 1 : Récupérer les commandes depuis RetailCRM ---
  let crmOrders;
  try {
    crmOrders = await retailcrm.fetchAllOrders();
  } catch (err) {
    console.error('❌ Erreur lors de la récupération RetailCRM :', err.message);
    process.exit(1);
  }

  if (crmOrders.length === 0) {
    console.log('ℹ️  Aucune commande trouvée dans RetailCRM.');
    return;
  }

  // --- Étape 2 : Insérer dans Supabase ---
  let savedOrders;
  try {
    savedOrders = await supabase.upsertOrders(crmOrders);
    console.log(`✅ ${savedOrders.length} commandes synchronisées dans Supabase`);
  } catch (err) {
    console.error('❌ Erreur lors de l\'insertion Supabase :', err.message);
    process.exit(1);
  }

  // --- Étape 3 : Alertes Telegram pour commandes importantes ---
  console.log('\n🔔 Vérification des commandes > 50 000 ₸...');

  let alertCount = 0;
  for (const order of savedOrders) {
    if (Number(order.total_sum) > 50000) {
      await telegram.notifyIfHighValue(order);
      alertCount++;
    }
  }

  if (alertCount === 0) {
    console.log('  ℹ️  Aucune commande ne dépasse 50 000 ₸');
  } else {
    console.log(`  📨 ${alertCount} alerte(s) envoyées`);
  }

  // --- Résumé final ---
  await telegram.notifySyncDone(savedOrders.length);

  console.log('\n✅ Synchronisation terminée avec succès !');
}

sync().catch((err) => {
  console.error('Erreur fatale :', err.message);
  process.exit(1);
});
