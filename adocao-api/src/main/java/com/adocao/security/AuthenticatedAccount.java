package com.adocao.security;

import com.adocao.enums.Perfil;

/**
 * Representa o "dono" do token JWT: pode ser um Usuario (adotante) ou uma Ong.
 * Guardado no SecurityContext apos a validacao do token, para uso nos
 * services/controllers via @AuthenticationPrincipal.
 */
public record AuthenticatedAccount(
        Long id,
        String email,
        String nome,
        Perfil perfil
) {
    public boolean isOng() {
        return perfil == Perfil.ROLE_ONG;
    }

    public boolean isAdotante() {
        return perfil == Perfil.ROLE_ADOTANTE;
    }
}
