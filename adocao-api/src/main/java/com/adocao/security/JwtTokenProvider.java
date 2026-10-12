package com.adocao.security;

import com.adocao.enums.Perfil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtTokenProvider(@Value("${app.jwt.secret}") String secret,
                             @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String gerarToken(Long id, String email, String nome, Perfil perfil) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("id", id)
                .claim("nome", nome)
                .claim("perfil", perfil.name())
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValido(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public AuthenticatedAccount toAuthenticatedAccount(String token) {
        Claims claims = parseClaims(token);
        Long id = claims.get("id", Integer.class) != null
                ? claims.get("id", Integer.class).longValue()
                : claims.get("id", Long.class);
        String email = claims.getSubject();
        String nome = claims.get("nome", String.class);
        Perfil perfil = Perfil.valueOf(claims.get("perfil", String.class));
        return new AuthenticatedAccount(id, email, nome, perfil);
    }
}
