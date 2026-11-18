import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { buscarAnimal, arquivarAnimal, alterarDisponibilidade } from '../services/animalService';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import {
  ArrowLeft,
  Pencil,
  HeartHandshake,
  Archive,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PawPrint
} from 'lucide-react';

export default function AnimalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(false);
  const [modalArquivar, setModalArquivar] = useState(false);

  function carregar() {
    setCarregando(true);
    buscarAnimal(id)
      .then(setAnimal)
      .catch(() => setErro('Animal não encontrado.'))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAlternarDisponibilidade() {
    setErro('');
    setProcessando(true);
    try {
      const atualizado = await alterarDisponibilidade(animal.id, animal.status !== 'DISPONIVEL');
      setAnimal(atualizado);
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível alterar a disponibilidade.');
    } finally {
      setProcessando(false);
    }
  }

  async function handleConfirmarArquivar() {
    setProcessando(true);
    try {
      await arquivarAnimal(animal.id);
      navigate('/animais');
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível arquivar o animal.');
      setModalArquivar(false);
    } finally {
      setProcessando(false);
    }
  }

  if (carregando) {
    return (
      <div className="space-y-6 max-w-4xl py-6">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 mb-4 inline-block">
          <AlertCircle className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Animal não encontrado</h2>
        <Link to="/animais">
          <Button variant="primary">Voltar para animais</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-16">
      <Link
        to="/animais"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar para lista de animais</span>
      </Link>

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {animal.especie}
            </span>
            <Badge variant={animal.status} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {animal.nome}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/animais/${animal.id}/interessados`}>
            <Button variant="secondary" size="md" icon={HeartHandshake}>
              Ver Interessados
            </Button>
          </Link>
          <Link to={`/animais/${animal.id}/editar`}>
            <Button variant="outline" size="md" icon={Pencil}>
              Editar
            </Button>
          </Link>
        </div>
      </div>

      {erro && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Grid de Informações */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Foto */}
        <div className="md:col-span-5">
          <div className="aspect-4/3 md:aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-soft">
            {animal.foto ? (
              <img
                src={animal.foto}
                alt={animal.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <PawPrint className="w-12 h-12 stroke-1 mb-2" />
                <span className="text-xs font-medium">Sem foto cadastrada</span>
              </div>
            )}
          </div>
        </div>

        {/* Detalhes */}
        <div className="md:col-span-7 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="block text-xs font-semibold text-slate-400 uppercase">Porte</span>
              <span className="block font-bold text-slate-800 text-sm mt-0.5 capitalize">
                {animal.porte ? animal.porte.toLowerCase() : '-'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="block text-xs font-semibold text-slate-400 uppercase">Sexo</span>
              <span className="block font-bold text-slate-800 text-sm mt-0.5">
                {animal.sexo === 'MACHO' ? 'Macho' : animal.sexo === 'FEMEA' ? 'Fêmea' : animal.sexo}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="block text-xs font-semibold text-slate-400 uppercase">Raça</span>
              <span className="block font-bold text-slate-800 text-sm mt-0.5 truncate">
                {animal.raca || 'Sem raça definida'}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200">
              <span className="block text-xs font-semibold text-slate-400 uppercase">Idade</span>
              <span className="block font-bold text-slate-800 text-sm mt-0.5">
                {animal.idade != null ? `${animal.idade} ano(s)` : 'Não informada'}
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Descrição e Cuidados
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {animal.descricao || 'Nenhuma descrição fornecida.'}
            </p>
          </div>

          {/* Barra de Ações Operacionais */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {(animal.status === 'DISPONIVEL' || animal.status === 'EM_PROCESSO') && (
              <Button
                variant={animal.status === 'DISPONIVEL' ? 'outline' : 'primary'}
                size="sm"
                loading={processando}
                icon={animal.status === 'DISPONIVEL' ? XCircle : CheckCircle2}
                onClick={handleAlternarDisponibilidade}
              >
                {animal.status === 'DISPONIVEL' ? 'Marcar como Indisponível' : 'Marcar como Disponível'}
              </Button>
            )}

            {animal.status !== 'ARQUIVADO' && (
              <Button
                variant="ghost"
                size="sm"
                icon={Archive}
                onClick={() => setModalArquivar(true)}
                className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 ml-auto"
              >
                Arquivar Animal
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Arquivamento */}
      <Modal
        isOpen={modalArquivar}
        onClose={() => setModalArquivar(false)}
        title="Arquivar Animal"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Tem certeza que deseja arquivar <strong>{animal.nome}</strong>? Ele deixará de ser exibido na lista pública de adoções.
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setModalArquivar(false)}
              disabled={processando}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              size="md"
              loading={processando}
              onClick={handleConfirmarArquivar}
            >
              Confirmar Arquivamento
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
