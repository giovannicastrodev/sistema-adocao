package com.adocao.dto.animal;

import com.adocao.enums.StatusAnimal;
import jakarta.validation.constraints.NotNull;

public record AlterarStatusAnimalRequest(
        @NotNull(message = "Status e obrigatorio") StatusAnimal status
) {
}
