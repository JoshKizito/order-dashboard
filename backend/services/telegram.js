// =============================================
// services/telegram.js — Notifications Telegram
// =============================================

const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

// Seuil en KZT (Tenge kazakhstanais)
const ALERT_THRESHOLD = 50000;

/**
 * Envoie un message texte brut via Telegram Bot API.
 *
 * @param {string} message - Texte à envoyer
 */
async function sendMessage(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('⚠️  Telegram non configuré (TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquant)');
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  await axios.post(url, {
    chat_id:    CHAT_ID,
    text:       message,
    parse_mode: 'HTML', // Permet d'utiliser <b>, <i>, etc.
  });
}

/**
 * Vérifie si une commande dépasse le seuil et envoie une alerte.
 * Appelée lors de la synchronisation RetailCRM → Supabase.
 *
 * @param {Object} order - Commande au format Supabase
 */
async function notifyIfHighValue(order) {
  if (Number(order.total_sum) > ALERT_THRESHOLD) {
    const message = [
      `🚨 <b>Обнаружен важный заказ!</b>`,
      ``,
      `📦 <b>Номер :</b> ${order.number}`,
      `👤 <b>Клиент :</b> ${order.customer_name}`,
      `💰 <b>Сумма :</b> ${Number(order.total_sum).toLocaleString('ru-RU')} ₸`,
      `📋 <b>Статус :</b> ${order.status}`,
      `📅 <b>Дата :</b> ${new Date(order.created_at).toLocaleDateString('ru-RU')}`,
      ``,
      `⚡ Порог превышен : ${ALERT_THRESHOLD.toLocaleString('ru-RU')} ₸`,
    ].join('\n');

    try {
      await sendMessage(message);
      console.log(`Алерт Telegram отправлен для заказа ${order.number}`);
    } catch (err) {
      console.error('Ошибка отправки Telegram :', err.message);
    }
  }
}

/**
 * Envoie un résumé après chaque synchronisation.
 *
 * @param {number} count - Nombre de commandes synchronisées
 */
async function notifySyncDone(count) {
  const message = [
    `✅ <b>Synchronisation terminée</b>`,
    `📊 ${count} commande(s) synchronisée(s) depuis RetailCRM`,
    `🕐 ${new Date().toLocaleString('fr-FR')}`,
  ].join('\n');

  try {
    await sendMessage(message);
  } catch (err) {
    console.error('Erreur envoi Telegram (résumé sync) :', err.message);
  }
}

module.exports = { sendMessage, notifyIfHighValue, notifySyncDone };
