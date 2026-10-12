package com.adocao.service;

import com.adocao.dto.solicitacao.SolicitacaoResponse;
import com.adocao.entity.Animal;
import com.adocao.entity.SolicitacaoAdocao;
import com.adocao.entity.Usuario;
import com.adocao.enums.StatusAnimal;
import com.adocao.enums.StatusSolicitacao;
import com.adocao.exception.BusinessException;
import com.adocao.exception.ForbiddenOperationException;
import com.adocao.exception.ResourceNotFoundException;
import com.adocao.repository.AnimalRepository;
import com.adocao.repository.SolicitacaoRepository;
import com.adocao.repository.UsuarioRepository;
import com.adocao.security.AuthenticatedAccount;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SolicitacaoService {

    private static final List<StatusSolicitacao> STATUS_ATIVOS =
            List.of(StatusSolicitacao.PENDENTE, StatusSolicitacao.EM_ANALISE);

    private final SolicitacaoRepository solicitacaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AnimalRepository animalRepository;
    private final AnimalService animalService;

    public SolicitacaoService(SolicitacaoRepository solicitacaoRepository,
                               UsuarioRepository usuarioRepository,
                               AnimalRepository animalRepository,
                               AnimalService animalService) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.animalRepository = animalRepository;
        this.animalService = animalService;
    }

    @Transactional
    public SolicitacaoResponse criar(Long animalId, AuthenticatedAccount account) {
        Usuario usuario = usuarioRepository.findById(account.id())
                .orElseThrow(() -> new ResourceNotFoundException("Adotante nao encontrado."));

        Animal animal = animalService.buscarEntidade(animalId);

        if (animal.getStatus() != StatusAnimal.DISPONIVEL) {
            throw new BusinessException("Este animal nao esta disponivel para adocao no momento.");
        }

        solicitacaoRepository.findAtivaPorUsuarioEAnimal(usuario.getId(), animal.getId(), STATUS_ATIVOS)
                .ifPresent(s -> {
                    throw new BusinessException("Voce ja possui uma solicitacao ativa para este animal.");
                });

        SolicitacaoAdocao solicitacao = SolicitacaoAdocao.builder()
                .usuario(usuario)
                .animal(animal)
                .status(StatusSolicitacao.PENDENTE)
                .build();

        solicitacao = solicitacaoRepository.save(solicitacao);
        return SolicitacaoResponse.fromEntity(solicitacao);
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarMinhas(AuthenticatedAccount account) {
        return solicitacaoRepository.findByUsuarioIdOrderByDataSolicitacaoDesc(account.id()).stream()
                .map(SolicitacaoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarDaOng(AuthenticatedAccount account) {
        return solicitacaoRepository.findByOngId(account.id()).stream()
                .map(SolicitacaoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SolicitacaoResponse> listarInteressados(Long animalId, AuthenticatedAccount account) {
        Animal animal = animalService.buscarEntidade(animalId);
        animalService.validarDonoOuLancar(animal, account);

        return solicitacaoRepository.findByAnimalIdOrderByDataSolicitacaoDesc(animalId).stream()
                .map(SolicitacaoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public SolicitacaoResponse buscarPorId(Long id, AuthenticatedAccount account) {
        SolicitacaoAdocao solicitacao = buscarEntidade(id);
        validarAcesso(solicitacao, account);
        return SolicitacaoResponse.fromEntity(solicitacao);
    }

    @Transactional
    public SolicitacaoResponse cancelar(Long id, AuthenticatedAccount account) {
        SolicitacaoAdocao solicitacao = buscarEntidade(id);

        if (!account.isAdotante() || !solicitacao.getUsuario().getId().equals(account.id())) {
            throw new ForbiddenOperationException("Voce so pode cancelar suas proprias solicitacoes.");
        }

        validarTransicaoPermitida(solicitacao, "cancelada");

        solicitacao.setStatus(StatusSolicitacao.CANCELADA);
        return SolicitacaoResponse.fromEntity(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponse colocarEmAnalise(Long id, AuthenticatedAccount account) {
        SolicitacaoAdocao solicitacao = buscarEntidade(id);
        animalService.validarDonoOuLancar(solicitacao.getAnimal(), account);

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE) {
            throw new BusinessException("Apenas solicitacoes pendentes podem ser colocadas em analise.");
        }

        solicitacao.setStatus(StatusSolicitacao.EM_ANALISE);
        return SolicitacaoResponse.fromEntity(solicitacaoRepository.save(solicitacao));
    }

    @Transactional
    public SolicitacaoResponse aprovar(Long id, AuthenticatedAccount account) {
        SolicitacaoAdocao solicitacao = buscarEntidade(id);
        Animal animal = solicitacao.getAnimal();
        animalService.validarDonoOuLancar(animal, account);

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE && solicitacao.getStatus() != StatusSolicitacao.EM_ANALISE) {
            throw new BusinessException("Apenas solicitacoes pendentes ou em analise podem ser aprovadas.");
        }
        if (animal.getStatus() != StatusAnimal.DISPONIVEL && animal.getStatus() != StatusAnimal.EM_PROCESSO) {
            throw new BusinessException("Este animal nao pode mais ser adotado (status atual: " + animal.getStatus() + ").");
        }

        solicitacao.setStatus(StatusSolicitacao.APROVADA);
        solicitacaoRepository.save(solicitacao);

        animal.setStatus(StatusAnimal.ADOTADO);
        animalRepository.save(animal);

        // Regra de negocio 5.6: recusa automaticamente as demais solicitacoes
        // ativas do mesmo animal, evitando estados inconsistentes.
        recusarDemaisSolicitacoesAtivas(animal.getId(), solicitacao.getId());

        return SolicitacaoResponse.fromEntity(solicitacao);
    }

    @Transactional
    public SolicitacaoResponse recusar(Long id, String observacao, AuthenticatedAccount account) {
        SolicitacaoAdocao solicitacao = buscarEntidade(id);
        animalService.validarDonoOuLancar(solicitacao.getAnimal(), account);

        if (solicitacao.getStatus() != StatusSolicitacao.PENDENTE && solicitacao.getStatus() != StatusSolicitacao.EM_ANALISE) {
            throw new BusinessException("Apenas solicitacoes pendentes ou em analise podem ser recusadas.");
        }

        solicitacao.setStatus(StatusSolicitacao.RECUSADA);
        if (observacao != null && !observacao.isBlank()) {
            solicitacao.setObservacao(observacao);
        }
        return SolicitacaoResponse.fromEntity(solicitacaoRepository.save(solicitacao));
    }

    // ----------------- privados -----------------

    /**
     * Regra de negocio 5.6 da documentacao: ao aprovar uma solicitacao, todas
     * as demais solicitacoes ativas (PENDENTE/EM_ANALISE) do mesmo animal sao
     * automaticamente recusadas, evitando estados inconsistentes.
     */
    private void recusarDemaisSolicitacoesAtivas(Long animalId, Long solicitacaoAprovadaId) {
        List<SolicitacaoAdocao> outras = solicitacaoRepository.findOutrasAtivasDoAnimal(animalId, STATUS_ATIVOS, solicitacaoAprovadaId);
        for (SolicitacaoAdocao outra : outras) {
            outra.setStatus(StatusSolicitacao.RECUSADA);
            outra.setObservacao("Animal adotado por outro interessado.");
        }
        solicitacaoRepository.saveAll(outras);
    }

    private void validarTransicaoPermitida(SolicitacaoAdocao solicitacao, String acaoDescricao) {
        if (solicitacao.getStatus() == StatusSolicitacao.APROVADA
                || solicitacao.getStatus() == StatusSolicitacao.RECUSADA
                || solicitacao.getStatus() == StatusSolicitacao.CANCELADA) {
            throw new BusinessException("Solicitacao com status " + solicitacao.getStatus() + " nao pode ser " + acaoDescricao + ".");
        }
    }

    private void validarAcesso(SolicitacaoAdocao solicitacao, AuthenticatedAccount account) {
        boolean donoDaSolicitacao = account.isAdotante() && solicitacao.getUsuario().getId().equals(account.id());
        boolean ongDoAnimal = account.isOng() && solicitacao.getAnimal().getOng().getId().equals(account.id());

        if (!donoDaSolicitacao && !ongDoAnimal) {
            throw new ForbiddenOperationException("Voce nao tem permissao para acessar esta solicitacao.");
        }
    }

    private SolicitacaoAdocao buscarEntidade(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitacao nao encontrada com id " + id));
    }
}
