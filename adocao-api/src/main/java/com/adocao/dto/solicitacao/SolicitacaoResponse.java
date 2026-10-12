package com.adocao.dto.solicitacao;

import com.adocao.entity.SolicitacaoAdocao;
import com.adocao.enums.StatusSolicitacao;

import java.time.LocalDateTime;

public record SolicitacaoResponse(
        Long id,
        Long usuarioId,
        String usuarioNome,
        Long animalId,
        String animalNome,
        Long ongId,
        String ongNome,
        LocalDateTime dataSolicitacao,
        LocalDateTime dataAtualizacao,
        StatusSolicitacao status,
        String observacao
) {
    public static SolicitacaoResponse fromEntity(SolicitacaoAdocao s) {
        return new SolicitacaoResponse(
                s.getId(),
                s.getUsuario().getId(),
                s.getUsuario().getNome(),
                s.getAnimal().getId(),
                s.getAnimal().getNome(),
                s.getAnimal().getOng().getId(),
                s.getAnimal().getOng().getNome(),
                s.getDataSolicitacao(),
                s.getDataAtualizacao(),
                s.getStatus(),
                s.getObservacao()
        );
    }
}
