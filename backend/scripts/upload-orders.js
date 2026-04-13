// =============================================
// scripts/upload-orders.js
// Upload des commandes mock vers RetailCRM
//
// Usage : node scripts/upload-orders.js
// =============================================

require('dotenv').config({ path: '../.env' });

const retailcrm   = require('../services/retailcrm');
const mockOrders  = require('./mock_orders.json');

// Pause entre chaque requête (en ms) pour éviter de dépasser les limites RetailCRM
const DELAY_MS = 300;

/**
 * Attend un certain nombre de millisecondes.
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convertit une commande mock au format attendu par RetailCRM.
 * Voir la doc RetailCRM : https://docs.retailcrm.ru/Developers/API/APIVersions/APIv5
 */
function toRetailCRMFormat(order) {
  return {
    externalId: order.id,            // Notre ID interne
    number:     order.number,
    status:     order.status,
    firstName:  order.firstName,
    lastName:   order.lastName,
    email:      order.email,
    phone:      order.phone,
    summ:       order.totalSumm,
    totalSumm:  order.totalSumm,
    createdAt:  order.createdAt,
  };
}

/**
 * Fonction principale : upload de toutes les commandes mock
 */
async function main() {
  console.log(`🚀 Début de l'upload de ${mockOrders.length} commandes vers RetailCRM`);
  console.log(`⏳ Délai entre chaque requête : ${DELAY_MS}ms\n`);

  let success = 0;
  let failed  = 0;

  for (let i = 0; i < mockOrders.length; i++) {
    const order   = mockOrders[i];
    const payload = toRetailCRMFormat(order);

    try {
      await retailcrm.createOrder(payload);
      success++;
      console.log(`  ✅ [${i + 1}/${mockOrders.length}] Commande ${order.number} uploadée`);
    } catch (err) {
      failed++;
      console.error(`  ❌ [${i + 1}/${mockOrders.length}] Erreur pour ${order.number} : ${err.message}`);
    }

    // Pause pour respecter les limites de l'API
    if (i < mockOrders.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n📊 Résultat final :`);
  console.log(`   ✅ Succès : ${success}`);
  console.log(`   ❌ Échecs : ${failed}`);
  console.log(`   📦 Total  : ${mockOrders.length}`);
}

main().catch((err) => {
  console.error('Erreur fatale :', err.message);
  process.exit(1);
});
