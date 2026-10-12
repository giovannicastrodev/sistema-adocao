package com.adocao.dto.animal;

import jakarta.validation.constraints.NotNull;

public record AlterarDisponibilidadeRequest(
        @NotNull(message = "Campo disponivel e obrigatorio") Boolean disponivel
) {
}
