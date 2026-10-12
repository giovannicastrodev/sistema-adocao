package com.adocao.service;

import com.adocao.dto.auth.*;
import com.adocao.entity.Ong;
import com.adocao.entity.Usuario;
import com.adocao.enums.Perfil;
import com.adocao.exception.EmailJaCadastradoException;
import com.adocao.exception.BusinessException;
import com.adocao.repository.OngRepository;
import com.adocao.repository.UsuarioRepository;
import com.adocao.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final OngRepository ongRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UsuarioRepository usuarioRepository,
                        OngRepository ongRepository,
                        PasswordEncoder passwordEncoder,
                        JwtTokenProvider jwtTokenProvider) {
        this.usuarioRepository = usuarioRepository;
        this.ongRepository = ongRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public LoginResponse cadastrarUsuario(CadastroUsuarioRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new EmailJaCadastradoException("Ja existe um cadastro de adotante com este email.");
        }
        if (ongRepository.existsByEmail(request.email())) {
            throw new EmailJaCadastradoException("Este email ja esta em uso por uma ONG.");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .telefone(request.telefone())
                .endereco(request.endereco())
                .build();

        usuario = usuarioRepository.save(usuario);

        String token = jwtTokenProvider.gerarToken(usuario.getId(), usuario.getEmail(), usuario.getNome(), Perfil.ROLE_ADOTANTE);
        return new LoginResponse(token, "Bearer", usuario.getId(), usuario.getNome(), Perfil.ROLE_ADOTANTE.name());
    }

    @Transactional
    public LoginResponse cadastrarOng(CadastroOngRequest request) {
        if (ongRepository.existsByEmail(request.email())) {
            throw new EmailJaCadastradoException("Ja existe uma ONG cadastrada com este email.");
        }
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new EmailJaCadastradoException("Este email ja esta em uso por um adotante.");
        }
        if (ongRepository.existsByCnpj(request.cnpj())) {
            throw new BusinessException("Ja existe uma ONG cadastrada com este CNPJ.");
        }

        Ong ong = Ong.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .telefone(request.telefone())
                .endereco(request.endereco())
                .cnpj(request.cnpj())
                .build();

        ong = ongRepository.save(ong);

        String token = jwtTokenProvider.gerarToken(ong.getId(), ong.getEmail(), ong.getNome(), Perfil.ROLE_ONG);
        return new LoginResponse(token, "Bearer", ong.getId(), ong.getNome(), Perfil.ROLE_ONG.name());
    }

    /**
     * Login unificado: procura o email primeiro entre os adotantes e depois
     * entre as ONGs, retornando o token com o perfil correspondente.
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        var usuarioOpt = usuarioRepository.findByEmail(request.email());
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            validarSenha(request.senha(), usuario.getSenha());
            String token = jwtTokenProvider.gerarToken(usuario.getId(), usuario.getEmail(), usuario.getNome(), Perfil.ROLE_ADOTANTE);
            return new LoginResponse(token, "Bearer", usuario.getId(), usuario.getNome(), Perfil.ROLE_ADOTANTE.name());
        }

        var ongOpt = ongRepository.findByEmail(request.email());
        if (ongOpt.isPresent()) {
            Ong ong = ongOpt.get();
            validarSenha(request.senha(), ong.getSenha());
            String token = jwtTokenProvider.gerarToken(ong.getId(), ong.getEmail(), ong.getNome(), Perfil.ROLE_ONG);
            return new LoginResponse(token, "Bearer", ong.getId(), ong.getNome(), Perfil.ROLE_ONG.name());
        }

        throw new BadCredentialsException("Email ou senha invalidos.");
    }

    private void validarSenha(String senhaInformada, String senhaHash) {
        if (!passwordEncoder.matches(senhaInformada, senhaHash)) {
            throw new BadCredentialsException("Email ou senha invalidos.");
        }
    }
}
