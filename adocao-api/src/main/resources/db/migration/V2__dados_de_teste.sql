-- Senha de todos os usuarios/ONGs de teste abaixo: 123456
-- Hash BCrypt: $2b$10$keYJ/6vdKzGgo6OJ/L0cN.eUJEPMvXgJ/HHuaQFxyO7i7Brqi/guy

INSERT INTO usuarios (nome, email, senha, telefone, endereco) VALUES
('Sarah Alves', 'sarah@example.com', '$2b$10$keYJ/6vdKzGgo6OJ/L0cN.eUJEPMvXgJ/HHuaQFxyO7i7Brqi/guy', '11999990001', 'Rua das Flores, 100 - Sao Paulo/SP'),
('Joao Silva', 'joao@example.com', '$2b$10$keYJ/6vdKzGgo6OJ/L0cN.eUJEPMvXgJ/HHuaQFxyO7i7Brqi/guy', '11999990002', 'Av. Brasil, 200 - Sao Paulo/SP');

INSERT INTO ongs (nome, email, senha, telefone, endereco, cnpj) VALUES
('Amigos de Quatro Patas', 'contato@amigosdequatropatas.org', '$2b$10$keYJ/6vdKzGgo6OJ/L0cN.eUJEPMvXgJ/HHuaQFxyO7i7Brqi/guy', '1133334444', 'Rua da Esperanca, 50 - Sao Paulo/SP', '12345678000190'),
('Instituto Patas Felizes', 'contato@patasfelizes.org', '$2b$10$keYJ/6vdKzGgo6OJ/L0cN.eUJEPMvXgJ/HHuaQFxyO7i7Brqi/guy', '1133335555', 'Av. dos Animais, 900 - Campinas/SP', '98765432000155');

INSERT INTO animais (nome, especie, raca, idade, porte, sexo, descricao, foto, status, ong_id) VALUES
('Rex', 'CACHORRO', 'Vira-lata', 3, 'MEDIO', 'MACHO', 'Rex e brincalhao e adora passear.', 'https://placehold.co/400x300?text=Rex', 'DISPONIVEL', 1),
('Luna', 'GATO', 'Siames', 2, 'PEQUENO', 'FEMEA', 'Luna e carinhosa e muito tranquila.', 'https://placehold.co/400x300?text=Luna', 'DISPONIVEL', 1),
('Thor', 'CACHORRO', 'Labrador', 1, 'GRANDE', 'MACHO', 'Thor e filhote, cheio de energia.', 'https://placehold.co/400x300?text=Thor', 'DISPONIVEL', 2),
('Mel', 'GATO', 'Vira-lata', 4, 'PEQUENO', 'FEMEA', 'Mel gosta de dormir no sol.', 'https://placehold.co/400x300?text=Mel', 'EM_PROCESSO', 2),
('Bidu', 'CACHORRO', 'Poodle', 6, 'PEQUENO', 'MACHO', 'Bidu e calmo e ja e castrado.', 'https://placehold.co/400x300?text=Bidu', 'ADOTADO', 1);

INSERT INTO solicitacoes_adocao (usuario_id, animal_id, status, observacao) VALUES
(1, 1, 'PENDENTE', NULL),
(2, 3, 'EM_ANALISE', NULL),
(1, 5, 'APROVADA', 'Adocao concluida com sucesso.');
