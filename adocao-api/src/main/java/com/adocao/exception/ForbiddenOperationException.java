package com.adocao.exception;

/**
 * Excecao para tentativas de acesso/alteracao de recursos que nao pertencem
 * ao usuario/ONG autenticado. Mapeada para 403 FORBIDDEN.
 */
public class ForbiddenOperationException extends RuntimeException {
    public ForbiddenOperationException(String message) {
        super(message);
    }
}
