package com.adocao.dto.solicitacao;

import jakarta.validation.constraints.NotNull;

public record SolicitacaoRequest(
        @NotNull(message = "animalId e obrigatorio") Long animalId
) {
}
