import { useEffect, useState } from 'react';
import { buscarDashboard } from '../services/dashboardService';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [indicadores, setIndicadores] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarDashboard()
      .then(setIndicadores)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="carregando">Carregando...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid-stats">
        <StatCard titulo="Animais cadastrados" valor={indicadores.animaisCadastrados} />
        <StatCard titulo="Animais disponíveis" valor={indicadores.animaisDisponiveis} />
        <StatCard titulo="Em processo de adoção" valor={indicadores.animaisEmProcesso} />
        <StatCard titulo="Animais adotados" valor={indicadores.animaisAdotados} />
        <StatCard titulo="Solicitações pendentes" valor={indicadores.solicitacoesPendentes} />
        <StatCard titulo="Solicitações em análise" valor={indicadores.solicitacoesEmAnalise} />
      </div>
    </div>
  );
}
