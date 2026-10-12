package com.adocao.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CadastroOngRequest(
        @NotBlank(message = "Nome e obrigatorio") String nome,
        @NotBlank(message = "Email e obrigatorio") @Email(message = "Email invalido") String email,
        @NotBlank(message = "Senha e obrigatoria") @Size(min = 6, message = "Senha deve ter ao menos 6 caracteres") String senha,
        String telefone,
        String endereco,
        @NotBlank(message = "CNPJ e obrigatorio")
        @Pattern(regexp = "\\d{14}|\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}", message = "CNPJ invalido")
        String cnpj
) {
}
