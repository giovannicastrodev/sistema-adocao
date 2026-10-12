package com.adocao.controller;

import com.adocao.dto.solicitacao.RecusarSolicitacaoRequest;
import com.adocao.dto.solicitacao.SolicitacaoRequest;
import com.adocao.dto.solicitacao.SolicitacaoResponse;
import com.adocao.security.AuthenticatedAccount;
import com.adocao.service.SolicitacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Solicitacoes", description = "Solicitacoes de adocao criadas por adotantes e analisadas pelas ONGs")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService) {
        this.solicitacaoService = solicitacaoService;
    }

    @PostMapping("/api/solicitacoes")
    @PreAuthorize("hasRole('ADOTANTE')")
    @Operation(summary = "Cria uma solicitacao de adocao (somente adotante autenticado)")
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoRequest request,
                                                      @AuthenticationPrincipal AuthenticatedAccount account) {
        SolicitacaoResponse response = solicitacaoService.criar(request.animalId(), account);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/api/solicitacoes/minhas")
    @PreAuthorize("hasRole('ADOTANTE')")
    @Operation(summary = "Lista as solicitacoes do adotante autenticado")
    public ResponseEntity<List<SolicitacaoResponse>> listarMinhas(@AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(solicitacaoService.listarMinhas(account));
    }

    @GetMapping("/api/solicitacoes/{id}")
    @Operation(summary = "Detalhes de uma solicitacao (dono da solicitacao ou ONG responsavel pelo animal)")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id,
                                                            @AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id, account));
    }

    @PatchMapping("/api/solicitacoes/{id}/cancelar")
    @PreAuthorize("hasRole('ADOTANTE')")
    @Operation(summary = "Cancela a propria solicitacao (somente o adotante dono)")
    public ResponseEntity<SolicitacaoResponse> cancelar(@PathVariable Long id,
                                                         @AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(solicitacaoService.cancelar(id, account));
    }

    @GetMapping("/api/ongs/solicitacoes")
    @PreAuthorize("hasRole('ONG')")
    @Operation(summary = "Lista as solicitacoes recebidas pela ONG autenticada")
    public ResponseEntity<List<SolicitacaoResponse>> listarDaOng(@AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(solicitacaoService.listarDaOng(account));
    }

    @GetMapping("/api/animais/{animalId}/interessados")
    @PreAuthorize("hasRole('ONG')")
    @Operation(summary = "Lista os interessados em um animal (somente a ONG responsavel)")
    public ResponseEntity<List<SolicitacaoResponse>> listarInteressados(@PathVariable Long animalId,
                                                                         @AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(solicitacaoService.listarInteressados(animalId, account));
    }

    @PatchMapping("/api/solicitacoes/{id}/analise")
    @PreAuthorize("hasRole('ONG')")
    @Operation(summary = "Coloca a solicitacao em analise (somente a ONG responsavel pelo animal)")
    public ResponseEntity<SolicitacaoResponse> colocarEmAnalise(@PathVariable Long id,
                                                                 @AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(solicitacaoService.colocarEmAnalise(id, account));
    }

    @PatchMapping("/api/solicitacoes/{id}/aprovar")
    @PreAuthorize("hasRole('ONG')")
    @Operation(summary = "Aprova a solicitacao; o animal passa para ADOTADO e as demais solicitacoes ativas sao recusadas")
    public ResponseEntity<SolicitacaoResponse> aprovar(@PathVariable Long id,
                                                        @AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(solicitacaoService.aprovar(id, account));
    }

    @PatchMapping("/api/solicitacoes/{id}/recusar")
    @PreAuthorize("hasRole('ONG')")
    @Operation(summary = "Recusa a solicitacao (somente a ONG responsavel pelo animal)")
    public ResponseEntity<SolicitacaoResponse> recusar(@PathVariable Long id,
                                                        @RequestBody(required = false) RecusarSolicitacaoRequest request,
                                                        @AuthenticationPrincipal AuthenticatedAccount account) {
        String observacao = request != null ? request.observacao() : null;
        return ResponseEntity.ok(solicitacaoService.recusar(id, observacao, account));
    }
}
