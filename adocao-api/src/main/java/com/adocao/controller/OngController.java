package com.adocao.controller;

import com.adocao.dto.animal.AnimalResponse;
import com.adocao.enums.StatusAnimal;
import com.adocao.enums.StatusSolicitacao;
import com.adocao.security.AuthenticatedAccount;
import com.adocao.service.AnimalService;
import com.adocao.service.SolicitacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ongs")
@PreAuthorize("hasRole('ONG')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "ONG", description = "Painel e listagem de animais da ONG autenticada")
public class OngController {

    private final AnimalService animalService;
    private final SolicitacaoService solicitacaoService;

    public OngController(AnimalService animalService, SolicitacaoService solicitacaoService) {
        this.animalService = animalService;
        this.solicitacaoService = solicitacaoService;
    }

    @GetMapping("/animais")
    @Operation(summary = "Lista todos os animais (qualquer status) cadastrados pela ONG autenticada")
    public ResponseEntity<List<AnimalResponse>> listarMeusAnimais(@AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(animalService.listarDaOng(account.id()));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Indicadores do dashboard da ONG autenticada")
    public ResponseEntity<Map<String, Long>> dashboard(@AuthenticationPrincipal AuthenticatedAccount account) {
        List<AnimalResponse> animais = animalService.listarDaOng(account.id());
        var solicitacoes = solicitacaoService.listarDaOng(account);

        Map<String, Long> indicadores = Map.of(
                "animaisCadastrados", (long) animais.size(),
                "animaisDisponiveis", animais.stream().filter(a -> a.status() == StatusAnimal.DISPONIVEL).count(),
                "animaisEmProcesso", animais.stream().filter(a -> a.status() == StatusAnimal.EM_PROCESSO).count(),
                "animaisAdotados", animais.stream().filter(a -> a.status() == StatusAnimal.ADOTADO).count(),
                "solicitacoesPendentes", solicitacoes.stream().filter(s -> s.status() == StatusSolicitacao.PENDENTE).count(),
                "solicitacoesEmAnalise", solicitacoes.stream().filter(s -> s.status() == StatusSolicitacao.EM_ANALISE).count()
        );
        return ResponseEntity.ok(indicadores);
    }
}
