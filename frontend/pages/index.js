// pages/index.js
// Page principale du tableau de bord des commandes

import { useState, useEffect } from 'react';
import Head from 'next/head';
import StatsCard    from '../components/StatsCard';
import OrdersChart  from '../components/OrdersChart';

// URL du backend Express (définie dans next.config.js)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

// Seuil pour signaler visuellement les grosses commandes
const HIGH_VALUE_THRESHOLD = 50000;

export default function Dashboard() {
  // --- État de l'application ---
  const [stats,      setStats]      = useState(null);   // { totalOrders, totalRevenue }
  const [chartData,  setChartData]  = useState([]);     // Données pour le graphique
  const [orders,     setOrders]     = useState([]);     // Liste complète des commandes
  const [loading,    setLoading]    = useState(true);   // En cours de chargement ?
  const [error,      setError]      = useState(null);   // Message d'erreur
  const [syncing,    setSyncing]    = useState(false);  // Synchronisation en cours ?

  // --- Charger les données au démarrage ---
  useEffect(() => {
    loadAll();
  }, []);

  /**
   * Charge les statistiques, données graphique et liste des commandes
   */
  async function loadAll() {
    setLoading(true);
    setError(null);

    try {
      // Lancer les 3 requêtes en parallèle pour aller plus vite
      const [statsRes, chartRes, ordersRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/orders/stats`),
        fetch(`${BACKEND_URL}/api/orders/by-date`),
        fetch(`${BACKEND_URL}/api/orders`),
      ]);

      // Vérifier que toutes les réponses sont OK
      if (!statsRes.ok || !chartRes.ok || !ordersRes.ok) {
        throw new Error('Ошибка при получении данных');
      }

      const statsJson  = await statsRes.json();
      const chartJson  = await chartRes.json();
      const ordersJson = await ordersRes.json();

      setStats(statsJson.data);
      setChartData(chartJson.data);
      setOrders(ordersJson.data);

    } catch (err) {
      setError(`Невозможно загрузить данные : ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Formate un nombre en monnaie (ex: 50000 → "50 000 ₸")
   */
  function formatCurrency(amount) {
    return Number(amount).toLocaleString('ru-RU') + ' ₸';
  }

  /**
   * Formate une date ISO en date lisible (ex: "2024-01-15" → "15/01/2024")
   */
  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('ru-RU');
  }

  /**
   * Retourne la classe CSS du badge de statut
   */
  function statusClass(status) {
    const classes = {
      new:       'Новый',
      confirmed: 'Подтверждён',
      shipped:   'Отправлен',
      delivered: 'Доставлен',
    };
    return `status-badge ${classes[status] || 'status-new'}`;
  }

  // --- Rendu ---
  return (
    <>
      <Head>
        <title>Панель заказов</title>
        <meta name="description" content="Mini tableau de bord de commandes" />
      </Head>

      <div className="dashboard">

        {/* ===== En-tête ===== */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">📦 Панель заказов</h1>
            <p className="dashboard-subtitle">
              Заказы синхронизированы из RetailCRM
            </p>
          </div>

          <button
            className="sync-button"
            onClick={loadAll}
            disabled={loading || syncing}
          >
            {loading ? '⏳ Загрузка...' : '🔄 Обновить'}
          </button>
        </div>

        {/* ===== État d'erreur ===== */}
        {error && (
          <div className="error-state">
            ❌ {error}
            <br />
            <small>Убедитесь, что бэкенд запущен на {BACKEND_URL}</small>
          </div>
        )}

        {/* ===== État de chargement ===== */}
        {loading && !error && (
          <div className="loading-state">⏳ Загрузка данных...</div>
        )}

        {/* ===== Contenu principal ===== */}
        {!loading && !error && (
          <>
            {/* --- Cartes statistiques --- */}
            <div className="stats-grid">
              <StatsCard
                icon="📦"
                label="Всего заказов"
                value={stats?.totalOrders ?? 0}
              />
              <StatsCard
                icon="💰"
                label="Общая выручка"
                value={formatCurrency(stats?.totalRevenue ?? 0)}
              />
              <StatsCard
                icon="🚨"
                label="Заказы > 50 000 ₸"
                value={orders.filter(o => Number(o.total_sum) > HIGH_VALUE_THRESHOLD).length}
              />
              <StatsCard
                icon="✅"
                label="Доставлено"
                value={orders.filter(o => o.status === 'delivered').length}
              />
            </div>

            {/* --- Graphique des commandes --- */}
            <div className="chart-section">
              <h2 className="section-title">📊 Заказы по времени</h2>
              <OrdersChart data={chartData} />
            </div>

            {/* --- Tableau des commandes --- */}
            <div className="orders-section">
              <h2 className="section-title">
                🗂️ Последние заказы ({orders.length})
              </h2>

              {orders.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>
                  Нет заказов. Запустите : <code>node scripts/sync-orders.js</code>
                </p>
              ) : (
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Номер</th>
                      <th>Клиент</th>
                      <th>Статус</th>
                      <th>Сумма</th>
                      <th>Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>{order.number}</strong></td>
                        <td>{order.customer_name}</td>
                        <td>
                          <span className={statusClass(order.status)}>
                            {order.status}
                          </span>
                        </td>
                        <td className={Number(order.total_sum) > HIGH_VALUE_THRESHOLD ? 'high-value' : ''}>
                          {formatCurrency(order.total_sum)}
                          {Number(order.total_sum) > HIGH_VALUE_THRESHOLD && ' 🚨'}
                        </td>
                        <td>{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
