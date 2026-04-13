// components/StatsCard.js
// Carte qui affiche une statistique (ex: "Total commandes : 50")

export default function StatsCard({ icon, label, value }) {
  return (
    <div className="stat-card">
      {/* Icône emoji */}
      <span className="stat-icon">{icon}</span>

      <div>
        {/* Libellé de la statistique */}
        <div className="stat-label">{label}</div>

        {/* Valeur de la statistique */}
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}
