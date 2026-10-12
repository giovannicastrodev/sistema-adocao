package com.adocao.dto.auth;

public record LoginResponse(
        String token,
        String tipo,
        Long id,
        String nome,
        String perfil
) {
}
