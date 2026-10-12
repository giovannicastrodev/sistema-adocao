package com.adocao.service;

import com.adocao.dto.auth.CadastroUsuarioRequest;
import com.adocao.dto.auth.LoginRequest;
import com.adocao.entity.Usuario;
import com.adocao.exception.EmailJaCadastradoException;
import com.adocao.repository.OngRepository;
import com.adocao.repository.UsuarioRepository;
import com.adocao.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UsuarioRepository usuarioRepository;
    @Mock private OngRepository ongRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
    }

    @Test
    void deveImpedirCadastroComEmailDuplicado() {
        var request = new CadastroUsuarioRequest("Sarah", "sarah@x.com", "123456", "119999", "Rua A");
        when(usuarioRepository.existsByEmail("sarah@x.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.cadastrarUsuario(request))
                .isInstanceOf(EmailJaCadastradoException.class);

        verify(usuarioRepository, never()).save(any());
    }

    @Test
    void loginComSenhaInvalidaDeveLancarBadCredentials() {
        Usuario usuario = Usuario.builder().id(1L).nome("Sarah").email("sarah@x.com").senha("hash").build();
        when(usuarioRepository.findByEmail("sarah@x.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("errada", "hash")).thenReturn(false);

        var request = new LoginRequest("sarah@x.com", "errada");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void loginComEmailInexistenteDeveLancarBadCredentials() {
        when(usuarioRepository.findByEmail("naoexiste@x.com")).thenReturn(Optional.empty());
        when(ongRepository.findByEmail("naoexiste@x.com")).thenReturn(Optional.empty());

        var request = new LoginRequest("naoexiste@x.com", "123456");

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(BadCredentialsException.class);
    }
}
