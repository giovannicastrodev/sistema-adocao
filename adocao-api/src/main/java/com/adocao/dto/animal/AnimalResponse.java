package com.adocao.dto.animal;

import com.adocao.entity.Animal;
import com.adocao.enums.Especie;
import com.adocao.enums.Porte;
import com.adocao.enums.Sexo;
import com.adocao.enums.StatusAnimal;

import java.time.LocalDateTime;

public record AnimalResponse(
        Long id,
        String nome,
        Especie especie,
        String raca,
        Integer idade,
        Porte porte,
        Sexo sexo,
        String descricao,
        String foto,
        StatusAnimal status,
        LocalDateTime dataCadastro,
        LocalDateTime dataAtualizacao,
        Long ongId,
        String ongNome
) {
    public static AnimalResponse fromEntity(Animal animal) {
        return new AnimalResponse(
                animal.getId(),
                animal.getNome(),
                animal.getEspecie(),
                animal.getRaca(),
                animal.getIdade(),
                animal.getPorte(),
                animal.getSexo(),
                animal.getDescricao(),
                animal.getFoto(),
                animal.getStatus(),
                animal.getDataCadastro(),
                animal.getDataAtualizacao(),
                animal.getOng().getId(),
                animal.getOng().getNome()
        );
    }
}
