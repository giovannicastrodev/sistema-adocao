CREATE TABLE usuarios (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    senha           VARCHAR(255) NOT NULL,
    telefone        VARCHAR(20),
    endereco        VARCHAR(255),
    data_cadastro   TIMESTAMP NOT NULL DEFAULT now(),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE ongs (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    senha           VARCHAR(255) NOT NULL,
    telefone        VARCHAR(20),
    endereco        VARCHAR(255),
    cnpj            VARCHAR(18) NOT NULL UNIQUE,
    data_cadastro   TIMESTAMP NOT NULL DEFAULT now(),
    ativo           BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE animais (
    id                  BIGSERIAL PRIMARY KEY,
    nome                VARCHAR(100) NOT NULL,
    especie             VARCHAR(20) NOT NULL CHECK (especie IN ('CACHORRO','GATO','OUTRO')),
    raca                VARCHAR(100),
    idade               INT CHECK (idade >= 0),
    porte               VARCHAR(20) NOT NULL CHECK (porte IN ('PEQUENO','MEDIO','GRANDE')),
    sexo                VARCHAR(10) NOT NULL CHECK (sexo IN ('MACHO','FEMEA')),
    descricao           TEXT,
    foto                VARCHAR(500),
    status              VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL'
                        CHECK (status IN ('DISPONIVEL','EM_PROCESSO','ADOTADO','ARQUIVADO')),
    data_cadastro       TIMESTAMP NOT NULL DEFAULT now(),
    data_atualizacao    TIMESTAMP,
    ong_id              BIGINT NOT NULL REFERENCES ongs(id)
);

CREATE INDEX idx_animais_status_especie_porte ON animais (status, especie, porte);
CREATE INDEX idx_animais_ong_id ON animais (ong_id);

CREATE TABLE solicitacoes_adocao (
    id                  BIGSERIAL PRIMARY KEY,
    usuario_id          BIGINT NOT NULL REFERENCES usuarios(id),
    animal_id           BIGINT NOT NULL REFERENCES animais(id),
    data_solicitacao    TIMESTAMP NOT NULL DEFAULT now(),
    data_atualizacao    TIMESTAMP,
    status              VARCHAR(20) NOT NULL DEFAULT 'PENDENTE'
                        CHECK (status IN ('PENDENTE','EM_ANALISE','APROVADA','RECUSADA','CANCELADA')),
    observacao          TEXT
);

CREATE INDEX idx_solicitacoes_usuario_id ON solicitacoes_adocao (usuario_id);
CREATE INDEX idx_solicitacoes_animal_id ON solicitacoes_adocao (animal_id);

-- Garante no maximo uma solicitacao ATIVA (PENDENTE/EM_ANALISE) por par usuario+animal
CREATE UNIQUE INDEX uq_solicitacao_ativa_usuario_animal
    ON solicitacoes_adocao (usuario_id, animal_id)
    WHERE status IN ('PENDENTE', 'EM_ANALISE');
