package com.adocao.service;

import com.adocao.entity.Animal;
import com.adocao.entity.Ong;
import com.adocao.entity.SolicitacaoAdocao;
import com.adocao.entity.Usuario;
import com.adocao.enums.*;
import com.adocao.exception.BusinessException;
import com.adocao.exception.ForbiddenOperationException;
import com.adocao.repository.AnimalRepository;
import com.adocao.repository.SolicitacaoRepository;
import com.adocao.repository.UsuarioRepository;
import com.adocao.security.AuthenticatedAccount;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolicitacaoServiceTest {

    @Mock private SolicitacaoRepository solicitacaoRepository;
    @Mock private UsuarioRepository usuarioRepository;
    @Mock private AnimalRepository animalRepository;
    @Mock private AnimalService animalService;

    @InjectMocks
    private SolicitacaoService solicitacaoService;

    private Usuario usuario;
    private Ong ong;
    private Animal animal;
    private AuthenticatedAccount contaAdotante;
    private AuthenticatedAccount contaOng;

    @BeforeEach
    void setUp() {
        usuario = Usuario.builder().id(1L).nome("Sarah").build();
        ong = Ong.builder().id(1L).nome("ONG Dona").build();
        animal = Animal.builder().id(10L).nome("Rex").status(StatusAnimal.DISPONIVEL).ong(ong).build();

        contaAdotante = new AuthenticatedAccount(1L, "sarah@x.com", "Sarah", Perfil.ROLE_ADOTANTE);
        contaOng = new AuthenticatedAccount(1L, "ong@x.com", "ONG Dona", Perfil.ROLE_ONG);
    }

    @Test
    void deveImpedirSolicitacaoDuplicadaAtiva() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(animalService.buscarEntidade(10L)).thenReturn(animal);
        when(solicitacaoRepository.findAtivaPorUsuarioEAnimal(eq(1L), eq(10L), anyList()))
                .thenReturn(Optional.of(new SolicitacaoAdocao()));

        assertThatThrownBy(() -> solicitacaoService.criar(10L, contaAdotante))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("ja possui uma solicitacao ativa");
    }

    @Test
    void deveImpedirSolicitacaoParaAnimalIndisponivel() {
        animal.setStatus(StatusAnimal.ADOTADO);
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(usuario));
        when(animalService.buscarEntidade(10L)).thenReturn(animal);

        assertThatThrownBy(() -> solicitacaoService.criar(10L, contaAdotante))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("nao esta disponivel");
    }

    @Test
    void naoDevePermitirCancelarSolicitacaoJaAprovada() {
        SolicitacaoAdocao s = SolicitacaoAdocao.builder()
                .id(5L).usuario(usuario).animal(animal).status(StatusSolicitacao.APROVADA).build();
        when(solicitacaoRepository.findById(5L)).thenReturn(Optional.of(s));

        assertThatThrownBy(() -> solicitacaoService.cancelar(5L, contaAdotante))
                .isInstanceOf(BusinessException.class);
    }

    @Test
    void adotanteNaoPodeCancelarSolicitacaoDeOutroAdotante() {
        Usuario outroUsuario = Usuario.builder().id(2L).nome("Joao").build();
        SolicitacaoAdocao s = SolicitacaoAdocao.builder()
                .id(5L).usuario(outroUsuario).animal(animal).status(StatusSolicitacao.PENDENTE).build();
        when(solicitacaoRepository.findById(5L)).thenReturn(Optional.of(s));

        assertThatThrownBy(() -> solicitacaoService.cancelar(5L, contaAdotante))
                .isInstanceOf(ForbiddenOperationException.class);
    }

    @Test
    void aprovarDeveMudarAnimalParaAdotadoERecusarDemaisSolicitacoesAtivas() {
        SolicitacaoAdocao aprovada = SolicitacaoAdocao.builder()
                .id(1L).usuario(usuario).animal(animal).status(StatusSolicitacao.PENDENTE).build();

        SolicitacaoAdocao outraAtiva = SolicitacaoAdocao.builder()
                .id(2L).usuario(Usuario.builder().id(2L).build()).animal(animal).status(StatusSolicitacao.PENDENTE).build();

        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(aprovada));
        doNothing().when(animalService).validarDonoOuLancar(animal, contaOng);
        when(solicitacaoRepository.save(any(SolicitacaoAdocao.class))).thenAnswer(inv -> inv.getArgument(0));
        when(animalRepository.save(any(Animal.class))).thenAnswer(inv -> inv.getArgument(0));
        when(solicitacaoRepository.findOutrasAtivasDoAnimal(eq(10L), anyList(), eq(1L)))
                .thenReturn(List.of(outraAtiva));

        var response = solicitacaoService.aprovar(1L, contaOng);

        assertThat(response.status()).isEqualTo(StatusSolicitacao.APROVADA);
        assertThat(animal.getStatus()).isEqualTo(StatusAnimal.ADOTADO);
        assertThat(outraAtiva.getStatus()).isEqualTo(StatusSolicitacao.RECUSADA);
        verify(solicitacaoRepository).saveAll(List.of(outraAtiva));
    }

    @Test
    void naoDevePermitirAprovarSolicitacaoJaRecusada() {
        SolicitacaoAdocao s = SolicitacaoAdocao.builder()
                .id(1L).usuario(usuario).animal(animal).status(StatusSolicitacao.RECUSADA).build();
        when(solicitacaoRepository.findById(1L)).thenReturn(Optional.of(s));
        doNothing().when(animalService).validarDonoOuLancar(animal, contaOng);

        assertThatThrownBy(() -> solicitacaoService.aprovar(1L, contaOng))
                .isInstanceOf(BusinessException.class);
    }
}
