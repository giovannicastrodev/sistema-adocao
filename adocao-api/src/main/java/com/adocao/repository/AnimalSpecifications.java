package com.adocao.repository;

import com.adocao.entity.Animal;
import com.adocao.enums.Especie;
import com.adocao.enums.Porte;
import com.adocao.enums.Sexo;
import com.adocao.enums.StatusAnimal;
import org.springframework.data.jpa.domain.Specification;

/**
 * Specifications usadas pelo AnimalService para montar a query de listagem
 * publica (GET /api/animais) combinando filtros opcionais.
 */
public final class AnimalSpecifications {

    private AnimalSpecifications() {
    }

    public static Specification<Animal> comStatus(StatusAnimal status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Animal> comEspecie(Especie especie) {
        return (root, query, cb) -> especie == null ? null : cb.equal(root.get("especie"), especie);
    }

    public static Specification<Animal> comPorte(Porte porte) {
        return (root, query, cb) -> porte == null ? null : cb.equal(root.get("porte"), porte);
    }

    public static Specification<Animal> comSexo(Sexo sexo) {
        return (root, query, cb) -> sexo == null ? null : cb.equal(root.get("sexo"), sexo);
    }

    public static Specification<Animal> comIdade(Integer idade) {
        return (root, query, cb) -> idade == null ? null : cb.equal(root.get("idade"), idade);
    }

    public static Specification<Animal> comRaca(String raca) {
        return (root, query, cb) -> (raca == null || raca.isBlank())
                ? null
                : cb.like(cb.lower(root.get("raca")), "%" + raca.toLowerCase() + "%");
    }

    public static Specification<Animal> comTextoLivre(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) {
                return null;
            }
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("nome")), like),
                    cb.like(cb.lower(root.get("raca")), like),
                    cb.like(cb.lower(root.get("descricao")), like)
            );
        };
    }

    public static Specification<Animal> daOng(Long ongId) {
        return (root, query, cb) -> ongId == null ? null : cb.equal(root.get("ong").get("id"), ongId);
    }
}
