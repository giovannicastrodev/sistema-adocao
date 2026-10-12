import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buscarAnimal } from '../services/animalService';
import { criarSolicitacao } from '../services/solicitacaoService';
import { useAuth } from '../context/AuthContext';

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
      setMensagem('Interesse registrado! Acompanhe o andamento em "Minhas Solicitações".');
      setMostrarConfirmacao(false);
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível registrar seu interesse.');
      setMostrarConfirmacao(false);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) return <p className="carregando">Carregando...</p>;
  if (!animal) return <p className="mensagem-erro">{erro || 'Animal não encontrado.'}</p>;

  const disponivel = animal.status === 'DISPONIVEL';

  return (
    <div className="pagina-detalhes-animal">
      <img src={animal.foto || 'https://placehold.co/500x350?text=Sem+foto'} alt={animal.nome} className="detalhes-foto" />

      <div className="detalhes-info">
        <h1>{animal.nome}</h1>
        <p><strong>Espécie:</strong> {LABEL_ESPECIE[animal.especie] || animal.especie}</p>
        <p><strong>Raça:</strong> {animal.raca || 'Não informada'}</p>
        <p><strong>Idade:</strong> {animal.idade != null ? `${animal.idade} ano(s)` : 'Não informada'}</p>
        <p><strong>Porte:</strong> {animal.porte}</p>
        <p><strong>Sexo:</strong> {LABEL_SEXO[animal.sexo] || animal.sexo}</p>
        <p><strong>Descrição:</strong> {animal.descricao || 'Sem descrição.'}</p>
        <p><strong>ONG responsável:</strong> {animal.ongNome}</p>
        <p><strong>Disponibilidade:</strong> {disponivel ? 'Disponível' : animal.status}</p>

        {mensagem && <p className="mensagem-sucesso">{mensagem}</p>}
        {erro && <p className="mensagem-erro">{erro}</p>}

        {disponivel && !mensagem && (
          <button className="btn-primario btn-grande" onClick={handleClicarInteresse}>
            Tenho interesse
          </button>
        )}
      </div>

      {mostrarConfirmacao && (
        <div className="modal-fundo">
          <div className="modal-conteudo">
            <p>Deseja realmente demonstrar interesse neste animal?</p>
            <div className="modal-acoes">
              <button onClick={() => setMostrarConfirmacao(false)} className="btn-secundario">Cancelar</button>
              <button onClick={confirmarInteresse} className="btn-primario" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
