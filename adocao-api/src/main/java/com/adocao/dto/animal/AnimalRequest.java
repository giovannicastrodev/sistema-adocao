package com.adocao.dto.animal;

import com.adocao.enums.Especie;
import com.adocao.enums.Porte;
import com.adocao.enums.Sexo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AnimalRequest(
        @NotBlank(message = "Nome e obrigatorio") String nome,
        @NotNull(message = "Especie e obrigatoria") Especie especie,
        String raca,
        @Min(value = 0, message = "Idade nao pode ser negativa") Integer idade,
        @NotNull(message = "Porte e obrigatorio") Porte porte,
        @NotNull(message = "Sexo e obrigatorio") Sexo sexo,
        String descricao,
        String foto
) {
}
