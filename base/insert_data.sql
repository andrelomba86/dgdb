USE `dg`;

-- Inserindo dados na tabela docente
INSERT INTO `docente` (nome, endereco, data_nascimento, email, data_admissao, regime_juridico, regime_trabalho, regime_data_aplicacao) VALUES
('João Silva', 'Rua A, 123', '1980-05-15', 'joao.silva@email.com', '2015-03-01', 'Efetivo', 'DE', '2015-03-01'),
('Maria Santos', 'Av B, 456', '1975-08-22', 'maria.santos@email.com', '2016-02-15', 'Efetivo', 'DE', '2016-02-15'),
('Pedro Oliveira', 'Rua C, 789', '1982-11-30', 'pedro.oliveira@email.com', '2017-08-10', 'Efetivo', '40h', '2017-08-10'),
('Ana Pereira', 'Av D, 321', '1978-04-25', 'ana.pereira@email.com', '2014-01-20', 'Efetivo', 'DE', '2014-01-20'),
('Carlos Souza', 'Rua E, 654', '1985-07-18', 'carlos.souza@email.com', '2018-06-05', 'Efetivo', '40h', '2018-06-05');

-- Inserindo dados na tabela cargo
INSERT INTO `cargo` (descricao, data_cargo, matricula, referencia, docente_id) VALUES
('Professor Adjunto', '2015-03-01', 'MAT001', 'ADJ-4', 1),
('Professor Associado', '2016-02-15', 'MAT002', 'ASS-1', 2),
('Professor Adjunto', '2017-08-10', 'MAT003', 'ADJ-3', 3),
('Professor Titular', '2014-01-20', 'MAT004', 'TIT-1', 4),
('Professor Adjunto', '2018-06-05', 'MAT005', 'ADJ-2', 5);

-- Inserindo dados na tabela telefone
INSERT INTO `telefone` (telefone, tipo, docente_id) VALUES
('11999887766', 'Celular', 1),
('11998765432', 'Celular', 2),
('11987654321', 'Celular', 3),
('11976543210', 'Celular', 4),
('11965432109', 'Celular', 5);

-- Inserindo dados na tabela documentos
INSERT INTO `documentos` (tipo, documento, docente_id) VALUES
('CPF', '123.456.789-00', 1),
('RG', '12.345.678-9', 2),
('CPF', '987.654.321-00', 3),
('RG', '98.765.432-1', 1),
('CPF', '456.789.123-00', 5);

-- Inserindo dados na tabela conta_bancaria
INSERT INTO `conta_bancaria` (id, banco, agencia, conta, docente_id) VALUES
(1, '001', '1234-5', '123456-7', 1),
(2, '001', '2345-6', '234567-8', 2),
(3, '001', '3456-7', '345678-9', 3),
(4, '001', '4567-8', '456789-0', 4),
(5, '001', '5678-9', '567890-1', 5);