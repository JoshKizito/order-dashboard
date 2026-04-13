
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Format personnalisé pour l'info-bulle du graphique
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '12px',
      fontSize: '13px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <p style={{ fontWeight: 700, marginBottom: 8 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name === 'count'
            ? `📦 Заказов : ${entry.value}`
            : `💰 Выручка : ${entry.value.toLocaleString('ru-RU')} ₸`}
        </p>
      ))}
    </div>
  );
}

export default function OrdersChart({ data }) {
  // Si pas de données, afficher un message
  if (!data || data.length === 0) {
    return (
      <p style={{ color: '#6b7280', textAlign: 'center', padding: '40px 0' }}>
        Нет данных для отображения.
      </p>
    );
  }

  // Formater la date pour l'affichage (ex: "15 jan.")
  const formattedData = data.map((item) => ({
    ...item,
    dateLabel: new Date(item.date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    }),
  }));

  return (
    // ResponsiveContainer s'adapte à la largeur du conteneur parent
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        {/* Grille en arrière-plan */}
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

        {/* Axe horizontal : dates */}
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
        />

        {/* Axe vertical gauche : nombre de commandes */}
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
        />

        {/* Axe vertical droit : revenu */}
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />

        {/* Info-bulle personnalisée */}
        <Tooltip content={<CustomTooltip />} />

        {/* Légende */}
        <Legend
          formatter={(value) =>
            value === 'count' ? 'Кол-во заказов' : 'Выручка (₸)'
          }
        />

        {/* Barres : nombre de commandes */}
        <Bar
          yAxisId="left"
          dataKey="count"
          fill="#4f46e5"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />

        {/* Ligne : revenu */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenue"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ r: 4, fill: '#f59e0b' }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
