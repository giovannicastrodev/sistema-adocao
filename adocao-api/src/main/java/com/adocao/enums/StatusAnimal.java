package com.adocao.enums;

/**
 * Estado unico do animal. Substitui a antiga dupla status/disponibilidade:
 * DISPONIVEL ja representa "disponivel para adocao", eliminando divergencias
 * entre os dois campos.
 */
public enum StatusAnimal {
    DISPONIVEL,
    EM_PROCESSO,
    ADOTADO,
    ARQUIVADO
}
