package com.adocao.service;

import com.adocao.entity.Animal;
import com.adocao.entity.Ong;
import com.adocao.enums.*;
import com.adocao.exception.ForbiddenOperationException;
import com.adocao.exception.ResourceNotFoundException;
import com.adocao.repository.AnimalRepository;
import com.adocao.repository.OngRepository;
import com.adocao.security.AuthenticatedAccount;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnimalServiceTest {

    @Mock
    private AnimalRepository animalRepository;

    @Mock
    private OngRepository ongRepository;

    @InjectMocks
    private AnimalService animalService;

    private Ong ongDona;
    private Ong outraOng;
    private Animal animal;

    @BeforeEach
    void setUp() {
        ongDona = Ong.builder().id(1L).nome("ONG Dona").build();
        outraOng = Ong.builder().id(2L).nome("Outra ONG").build();
        animal = Animal.builder()
                .id(10L)
                .nome("Rex")
                .especie(Especie.CACHORRO)
                .porte(Porte.MEDIO)
                .sexo(Sexo.MACHO)
                .status(StatusAnimal.DISPONIVEL)
                .ong(ongDona)
                .build();
    }

    @Test
    void deveLancarNotFoundQuandoAnimalNaoExiste() {
        when(animalRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> animalService.buscarEntidade(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deveImpedirQueOutraOngEditeAnimal() {
        AuthenticatedAccount contaOutraOng = new AuthenticatedAccount(2L, "outra@ong.com", "Outra ONG", Perfil.ROLE_ONG);

        assertThatThrownBy(() -> animalService.validarDonoOuLancar(animal, contaOutraOng))
                .isInstanceOf(ForbiddenOperationException.class);
    }

    @Test
    void devePermitirQueOngDonaEditeAnimal() {
        AuthenticatedAccount contaDaOng = new AuthenticatedAccount(1L, "dona@ong.com", "ONG Dona", Perfil.ROLE_ONG);

        assertThatCode(() -> animalService.validarDonoOuLancar(animal, contaDaOng))
                .doesNotThrowAnyException();
    }

    @Test
    void deveImpedirAdotanteDeEditarAnimal() {
        AuthenticatedAccount contaAdotante = new AuthenticatedAccount(5L, "user@user.com", "Usuario", Perfil.ROLE_ADOTANTE);

        assertThatThrownBy(() -> animalService.validarDonoOuLancar(animal, contaAdotante))
                .isInstanceOf(ForbiddenOperationException.class);
    }

    @Test
    void arquivarDeveAlterarStatusParaArquivado() {
        AuthenticatedAccount contaDaOng = new AuthenticatedAccount(1L, "dona@ong.com", "ONG Dona", Perfil.ROLE_ONG);
        when(animalRepository.findById(10L)).thenReturn(Optional.of(animal));
        when(animalRepository.save(any(Animal.class))).thenAnswer(inv -> inv.getArgument(0));

        animalService.arquivar(10L, contaDaOng);

        assertThat(animal.getStatus()).isEqualTo(StatusAnimal.ARQUIVADO);
        verify(animalRepository).save(animal);
    }
}
