package com.adocao.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ongs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(length = 20)
    private String telefone;

    @Column(length = 255)
    private String endereco;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;

    @Column(nullable = false)
    private boolean ativo;

    @PrePersist
    public void prePersist() {
        this.dataCadastro = LocalDateTime.now();
        this.ativo = true;
    }
}
