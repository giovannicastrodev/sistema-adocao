export default function StatCard({ titulo, valor }) {
  return (
    <div className="stat-card">
      <span className="stat-valor">{valor}</span>
      <span className="stat-titulo">{titulo}</span>
    </div>
  );
}
