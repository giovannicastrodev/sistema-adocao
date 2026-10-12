package com.adocao.repository;

import com.adocao.entity.SolicitacaoAdocao;
import com.adocao.enums.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SolicitacaoRepository extends JpaRepository<SolicitacaoAdocao, Long> {

    List<SolicitacaoAdocao> findByUsuarioIdOrderByDataSolicitacaoDesc(Long usuarioId);

    List<SolicitacaoAdocao> findByAnimalIdOrderByDataSolicitacaoDesc(Long animalId);

    @Query("""
            SELECT s FROM SolicitacaoAdocao s
            WHERE s.animal.ong.id = :ongId
            ORDER BY s.dataSolicitacao DESC
            """)
    List<SolicitacaoAdocao> findByOngId(@Param("ongId") Long ongId);

    @Query("""
            SELECT s FROM SolicitacaoAdocao s
            WHERE s.animal.id = :animalId AND s.status IN :statusAtivos
            """)
    List<SolicitacaoAdocao> findAtivasPorAnimal(@Param("animalId") Long animalId,
                                                 @Param("statusAtivos") List<StatusSolicitacao> statusAtivos);

    @Query("""
            SELECT s FROM SolicitacaoAdocao s
            WHERE s.usuario.id = :usuarioId AND s.animal.id = :animalId AND s.status IN :statusAtivos
            """)
    Optional<SolicitacaoAdocao> findAtivaPorUsuarioEAnimal(@Param("usuarioId") Long usuarioId,
                                                            @Param("animalId") Long animalId,
                                                            @Param("statusAtivos") List<StatusSolicitacao> statusAtivos);

    @Query("""
            SELECT s FROM SolicitacaoAdocao s
            WHERE s.animal.id = :animalId AND s.status IN :statusAtivos AND s.id <> :excetoId
            """)
    List<SolicitacaoAdocao> findOutrasAtivasDoAnimal(@Param("animalId") Long animalId,
                                                      @Param("statusAtivos") List<StatusSolicitacao> statusAtivos,
                                                      @Param("excetoId") Long excetoId);
}
