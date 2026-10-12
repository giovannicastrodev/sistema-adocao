package com.adocao.controller;

import com.adocao.dto.animal.*;
import com.adocao.enums.Especie;
import com.adocao.enums.Porte;
import com.adocao.enums.Sexo;
import com.adocao.security.AuthenticatedAccount;
import com.adocao.service.AnimalService;
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
@RequestMapping("/api/animais")
@Tag(name = "Animais", description = "Listagem publica e gestao de animais pelas ONGs")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @GetMapping
    @Operation(summary = "Lista animais disponiveis, com filtros opcionais")
    public ResponseEntity<List<AnimalResponse>> listar(
            @RequestParam(required = false) Especie especie,
            @RequestParam(required = false) Porte porte,
            @RequestParam(required = false) Sexo sexo,
            @RequestParam(required = false) Integer idade,
            @RequestParam(required = false) String raca,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(animalService.listarPublico(especie, porte, sexo, idade, raca, q));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalhes de um animal")
    public ResponseEntity<AnimalResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ONG')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cadastra um novo animal (somente ONG autenticada)")
    public ResponseEntity<AnimalResponse> cadastrar(@Valid @RequestBody AnimalRequest request,
                                                     @AuthenticationPrincipal AuthenticatedAccount account) {
        AnimalResponse response = animalService.cadastrar(request, account);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ONG')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Edita um animal (somente a ONG responsavel)")
    public ResponseEntity<AnimalResponse> editar(@PathVariable Long id,
                                                  @Valid @RequestBody AnimalRequest request,
                                                  @AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(animalService.editar(id, request, account));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ONG')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Altera o status do animal (somente a ONG responsavel)")
    public ResponseEntity<AnimalResponse> alterarStatus(@PathVariable Long id,
                                                         @Valid @RequestBody AlterarStatusAnimalRequest request,
                                                         @AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(animalService.alterarStatus(id, request.status(), account));
    }

    @PatchMapping("/{id}/disponibilidade")
    @PreAuthorize("hasRole('ONG')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Alterna a disponibilidade do animal (somente a ONG responsavel)")
    public ResponseEntity<AnimalResponse> alterarDisponibilidade(@PathVariable Long id,
                                                                  @Valid @RequestBody AlterarDisponibilidadeRequest request,
                                                                  @AuthenticationPrincipal AuthenticatedAccount account) {
        return ResponseEntity.ok(animalService.alterarDisponibilidade(id, request.disponivel(), account));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ONG')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Arquiva (inativa) um animal, sem excluir o registro (somente a ONG responsavel)")
    public ResponseEntity<Void> arquivar(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedAccount account) {
        animalService.arquivar(id, account);
        return ResponseEntity.noContent().build();
    }
}
