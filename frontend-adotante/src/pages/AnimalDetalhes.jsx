import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { buscarAnimal } from '../services/animalService';
import { criarSolicitacao } from '../services/solicitacaoService';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import {
  PawPrint,
  Heart,
  Building2,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';

const LABEL_ESPECIE = { CACHORRO: 'Cachorro', GATO: 'Gato', OUTRO: 'Outro' };
const LABEL_SEXO = { MACHO: 'Macho', FEMEA: 'Fêmea' };

export default function AnimalDetalhes() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [imgErro, setImgErro] = useState(false);

  useEffect(() => {
    buscarAnimal(id)
      .then(setAnimal)
      .catch(() => setErro('Animal não encontrado.'))
      .finally(() => setCarregando(false));
  }, [id]);

  function handleClicarInteresse() {
    if (!usuario) {
      navigate('/login');
      return;
    }
    setMostrarConfirmacao(true);
  }

  async function confirmarInteresse() {
    setEnviando(true);
    setErro('');
    try {
      await criarSolicitacao(animal.id);
      setMensagem('Interesse registrado com sucesso! A equipe da ONG foi notificada e avaliará seu pedido.');
      setMostrarConfirmacao(false);
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível registrar seu interesse no momento.');
      setMostrarConfirmacao(false);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-48 rounded-xl" />
            <Skeleton className="h-6 w-32 rounded-lg" />
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 mb-4 inline-block">
          <AlertCircle className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Pet não encontrado</h2>
        <p className="text-stone-500 text-sm mb-6">{erro || 'Este animal não está mais disponível no sistema.'}</p>
        <Link to="/animais">
          <Button variant="primary">Voltar ao catálogo</Button>
        </Link>
      </div>
    );
  }

  const disponivel = animal.status === 'DISPONIVEL';
  const fotoSrc = !imgErro && animal.foto
    ? animal.foto
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* Botão de Retorno / Breadcrumb */}
      <Link
        to="/animais"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar para todos os pets</span>
      </Link>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Coluna da Imagem (5 colunas) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-4/3 sm:aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 shadow-soft border border-stone-200/80">
            <img
              src={fotoSrc}
              alt={animal.nome}
              onError={() => setImgErro(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={animal.status} className="shadow-xs" />
            </div>
          </div>

          {/* Card da ONG Responsável */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-soft flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-600 border border-orange-100 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                ONG Responsável
              </span>
              <h4 className="font-bold text-stone-900 text-sm">{animal.ongNome}</h4>
              <p className="text-xs text-stone-500 mt-0.5">Instituição cadastrada e verificada</p>
            </div>
          </div>
        </div>

        {/* Coluna de Detalhes (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {LABEL_ESPECIE[animal.especie] || animal.especie}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-semibold text-stone-500">
                {LABEL_SEXO[animal.sexo] || animal.sexo}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {animal.nome}
            </h1>
          </div>

          {/* Grid de Características Principais */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <span className="block text-xs font-medium text-stone-400">Porte</span>
              <span className="block font-bold text-stone-800 text-sm mt-0.5 capitalize">
                {animal.porte ? animal.porte.toLowerCase() : 'Não inf.'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <span className="block text-xs font-medium text-stone-400">Idade</span>
              <span className="block font-bold text-stone-800 text-sm mt-0.5">
                {animal.idade != null ? `${animal.idade} ano(s)` : 'Não inf.'}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <span className="block text-xs font-medium text-stone-400">Sexo</span>
              <span className="block font-bold text-stone-800 text-sm mt-0.5">
                {LABEL_SEXO[animal.sexo] || animal.sexo}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
              <span className="block text-xs font-medium text-stone-400">Raça</span>
              <span className="block font-bold text-stone-800 text-sm mt-0.5 truncate">
                {animal.raca || 'Mestiço'}
              </span>
            </div>
          </div>

          {/* História e Descrição */}
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-soft space-y-3">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-brand-500" />
              <span>História e Personalidade</span>
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
              {animal.descricao || 'Este pet está saudável, cheio de amor para compartilhar e à procura de uma família atenciosa e protetora.'}
            </p>
          </div>

          {/* Feedback de Sucesso */}
          {mensagem && (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="font-bold text-sm">Interesse Registrado com Sucesso!</h4>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed pl-7">{mensagem}</p>
              <div className="pl-7 pt-1">
                <Link to="/minhas-solicitacoes">
                  <Button variant="secondary" size="sm">
                    Ver Minhas Solicitações
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Feedback de Erro */}
          {erro && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{erro}</span>
            </div>
          )}

          {/* Caixa de Ação */}
          {disponivel && !mensagem && (
            <div className="p-6 rounded-3xl bg-linear-to-br from-orange-50 to-amber-50/50 border border-orange-200/60 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Se apaixonou por {animal.nome}?</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  Clique abaixo para demonstrar interesse sem compromisso financeiro.
                </p>
              </div>
              <Button
                variant="primary"
                size="lg"
                icon={Heart}
                onClick={handleClicarInteresse}
                className="w-full sm:w-auto shrink-0 shadow-md shadow-brand-500/25"
              >
                Tenho interesse em adotar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      {mostrarConfirmacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-600 border border-orange-100 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <button
                onClick={() => setMostrarConfirmacao(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Confirmar interesse em {animal.nome}?
              </h3>
              <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                Ao confirmar, uma solicitação com seu perfil será encaminhada para a ONG{' '}
                <strong>{animal.ongNome}</strong>. A equipe da ONG avaliará o pedido e entrará em contato.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setMostrarConfirmacao(false)}
                disabled={enviando}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={confirmarInteresse}
                loading={enviando}
              >
                Confirmar Adoção
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
