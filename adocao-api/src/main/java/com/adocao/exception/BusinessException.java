package com.adocao.exception;

/**
 * Excecao para violacoes de regra de negocio (ex.: solicitacao duplicada,
 * animal ja adotado, transicao de status invalida). Mapeada para 409 CONFLICT.
 */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
