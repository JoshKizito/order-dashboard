require('dotenv').config();
const supabase   = require('../services/supabase');
const telegram   = require('../services/telegram');
const mockOrders = require('./mock_orders.json');

async function syncMock() {
  console.log('🚀 Synchronisation des commandes mock...\n');

  const formatted = mockOrders.map(order => ({
    id:             order.id,
    number:         order.number,
    status:         order.status,
    total_sum:      order.totalSumm,
    customer_name:  `${order.firstName} ${order.lastName}`,
    customer_email: order.email,
    customer_phone: order.phone,
    created_at:     order.createdAt,
  }));

  const saved = await supabase.upsertOrders(formatted);
  console.log(`✅ ${saved.length} commandes synchronisées`);

  console.log('\n🔔 Envoi des alertes Telegram...');
  for (const order of saved) {
    await telegram.notifyIfHighValue(order);
  }

  console.log('\n🎉 Terminé !');
}

syncMock().catch(err => {
  console.error('Erreur :', err.message);
  process.exit(1);
});