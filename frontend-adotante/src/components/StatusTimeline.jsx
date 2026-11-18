import { Send, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const ETAPAS = [
  { chave: 'PENDENTE', label: 'Solicitação Enviada', desc: 'Seu pedido foi registrado no sistema.', icon: Send },
  { chave: 'EM_ANALISE', label: 'Em Análise pela ONG', desc: 'Os voluntários estão analisando seu perfil.', icon: Clock },
  { chave: 'APROVADA', label: 'Adoção Aprovada!', desc: 'Parabéns! Combine a retirada do pet com a ONG.', icon: CheckCircle2 },
];

export default function StatusTimeline({ status }) {
  const isRecusada = status === 'RECUSADA';
  const isCancelada = status === 'CANCELADA';

  if (isRecusada || isCancelada) {
    return (
      <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 my-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isRecusada ? 'bg-rose-100 text-rose-600' : 'bg-stone-200 text-stone-600'
          }`}>
            {isRecusada ? <XCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              Status Final: {isRecusada ? 'Solicitação Recusada' : 'Solicitação Cancelada'}
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              {isRecusada
                ? 'Outro adotante foi selecionado ou os critérios da ONG não foram atendidos.'
                : 'Você optou por cancelar esta solicitação antes da decisão da ONG.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const indiceAtual = ETAPAS.findIndex((e) => e.chave === status);

  return (
    <div className="my-6 p-6 rounded-3xl bg-white border border-stone-200/80 shadow-soft">
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-6">
        Progresso da Solicitação
      </h3>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-2">
        {/* Linha conectora Desktop */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-stone-200 -z-0" />

        {ETAPAS.map((etapa, idx) => {
          const Icon = etapa.icon;
          const concluida = idx < indiceAtual;
          const ativa = idx === indiceAtual;
          const pendente = idx > indiceAtual;

          return (
            <div
              key={etapa.chave}
              className="relative z-10 flex md:flex-col items-center md:text-center gap-4 md:gap-2 flex-1 w-full"
            >
              {/* Ícone da Etapa */}
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-200 shrink-0 ${
                  concluida
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : ativa
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 ring-4 ring-orange-100'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Textos */}
              <div className="md:px-2">
                <span
                  className={`block text-xs font-bold ${
                    ativa ? 'text-brand-600' : concluida ? 'text-stone-800' : 'text-stone-400'
                  }`}
                >
                  {etapa.label}
                </span>
                <span className="block text-[11px] text-stone-500 mt-0.5 leading-snug">
                  {etapa.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
