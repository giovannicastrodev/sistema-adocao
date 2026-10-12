package com.adocao.service;

import com.adocao.dto.animal.AnimalRequest;
import com.adocao.dto.animal.AnimalResponse;
import com.adocao.entity.Animal;
import com.adocao.entity.Ong;
import com.adocao.enums.*;
import com.adocao.exception.BusinessException;
import com.adocao.exception.ForbiddenOperationException;
import com.adocao.exception.ResourceNotFoundException;
import com.adocao.repository.AnimalRepository;
import com.adocao.repository.AnimalSpecifications;
import com.adocao.repository.OngRepository;
import com.adocao.security.AuthenticatedAccount;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final OngRepository ongRepository;

    public AnimalService(AnimalRepository animalRepository, OngRepository ongRepository) {
        this.animalRepository = animalRepository;
        this.ongRepository = ongRepository;
    }

    @Transactional(readOnly = true)
    public List<AnimalResponse> listarPublico(Especie especie, Porte porte, Sexo sexo,
                                               Integer idade, String raca, String q) {
        Specification<Animal> spec = Specification
                .where(AnimalSpecifications.comStatus(StatusAnimal.DISPONIVEL))
                .and(AnimalSpecifications.comEspecie(especie))
                .and(AnimalSpecifications.comPorte(porte))
                .and(AnimalSpecifications.comSexo(sexo))
                .and(AnimalSpecifications.comIdade(idade))
                .and(AnimalSpecifications.comRaca(raca))
                .and(AnimalSpecifications.comTextoLivre(q));

        return animalRepository.findAll(spec).stream().map(AnimalResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public AnimalResponse buscarPorId(Long id) {
        return AnimalResponse.fromEntity(buscarEntidade(id));
    }

    @Transactional
    public AnimalResponse cadastrar(AnimalRequest request, AuthenticatedAccount account) {
        Ong ong = ongRepository.findById(account.id())
                .orElseThrow(() -> new ResourceNotFoundException("ONG nao encontrada."));

        Animal animal = Animal.builder()
                .nome(request.nome())
                .especie(request.especie())
                .raca(request.raca())
                .idade(request.idade())
                .porte(request.porte())
                .sexo(request.sexo())
                .descricao(request.descricao())
                .foto(request.foto())
                .status(StatusAnimal.DISPONIVEL)
                .ong(ong)
                .build();

        animal = animalRepository.save(animal);
        return AnimalResponse.fromEntity(animal);
    }

    @Transactional
    public AnimalResponse editar(Long id, AnimalRequest request, AuthenticatedAccount account) {
        Animal animal = buscarEntidade(id);
        validarDonoOuLancar(animal, account);

        animal.setNome(request.nome());
        animal.setEspecie(request.especie());
        animal.setRaca(request.raca());
        animal.setIdade(request.idade());
        animal.setPorte(request.porte());
        animal.setSexo(request.sexo());
        animal.setDescricao(request.descricao());
        animal.setFoto(request.foto());

        return AnimalResponse.fromEntity(animalRepository.save(animal));
    }

    @Transactional
    public AnimalResponse alterarStatus(Long id, StatusAnimal novoStatus, AuthenticatedAccount account) {
        Animal animal = buscarEntidade(id);
        validarDonoOuLancar(animal, account);

        animal.setStatus(novoStatus);
        return AnimalResponse.fromEntity(animalRepository.save(animal));
    }

    /**
     * Atalho de compatibilidade com o contrato original da API: alterna entre
     * DISPONIVEL e EM_PROCESSO. Animais ADOTADOS ou ARQUIVADOS nao sao afetados
     * por este endpoint — use /status para essas transicoes.
     */
    @Transactional
    public AnimalResponse alterarDisponibilidade(Long id, boolean disponivel, AuthenticatedAccount account) {
        Animal animal = buscarEntidade(id);
        validarDonoOuLancar(animal, account);

        if (animal.getStatus() == StatusAnimal.ADOTADO || animal.getStatus() == StatusAnimal.ARQUIVADO) {
            throw new BusinessException("Nao e possivel alterar a disponibilidade de um animal " + animal.getStatus() + ".");
        }

        animal.setStatus(disponivel ? StatusAnimal.DISPONIVEL : StatusAnimal.EM_PROCESSO);
        return AnimalResponse.fromEntity(animalRepository.save(animal));
    }

    @Transactional
    public void arquivar(Long id, AuthenticatedAccount account) {
        Animal animal = buscarEntidade(id);
        validarDonoOuLancar(animal, account);

        animal.setStatus(StatusAnimal.ARQUIVADO);
        animalRepository.save(animal);
    }

    @Transactional(readOnly = true)
    public List<AnimalResponse> listarDaOng(Long ongId) {
        Specification<Animal> spec = AnimalSpecifications.daOng(ongId);
        return animalRepository.findAll(spec).stream().map(AnimalResponse::fromEntity).toList();
    }

    @Transactional(readOnly = true)
    public Animal buscarEntidade(Long id) {
        return animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal nao encontrado com id " + id));
    }

    public void validarDonoOuLancar(Animal animal, AuthenticatedAccount account) {
        if (!account.isOng() || !animal.getOng().getId().equals(account.id())) {
            throw new ForbiddenOperationException("Voce nao tem permissao para alterar este animal.");
        }
    }
}
