-- MySQL initialization script for DGDB project
-- Combines docentes domain schema with authentication tables

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Create schema
CREATE SCHEMA IF NOT EXISTS `dg`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `dg`;

-- Table: docente
CREATE TABLE IF NOT EXISTS `docente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `endereco` VARCHAR(200) NULL,
  `data_nascimento` DATE NULL,
  `matricula` VARCHAR(10) NULL,
  `email` VARCHAR(80) NULL,
  `data_admissao` DATE NULL,
  `regime_juridico` VARCHAR(15) NULL,
  `regime_trabalho` VARCHAR(15) NULL,
  `regime_data_aplicacao` DATE NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_docente_matricula` (`matricula` ASC) VISIBLE,
  UNIQUE INDEX `uq_docente_email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table: progressao
CREATE TABLE IF NOT EXISTS `progressao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `funcao` VARCHAR(60) NULL,
  `data_inicio` DATE NULL,
  `data_termino` DATE NULL,
  `referencia` VARCHAR(45) NULL,
  `docente_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_progressao_docente1_idx` (`docente_id` ASC) VISIBLE,
  CONSTRAINT `fk_progressao_docente1`
    FOREIGN KEY (`docente_id`)
    REFERENCES `docente` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table: telefone
CREATE TABLE IF NOT EXISTS `telefone` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `telefone` VARCHAR(15) NOT NULL,
  `tipo` VARCHAR(20) NOT NULL,
  `docente_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_telefone_docente_numero` (`docente_id` ASC, `telefone` ASC) VISIBLE,
  INDEX `fk_telefone_docentes1_idx` (`docente_id` ASC) VISIBLE,
  CONSTRAINT `fk_telefone_docentes1`
    FOREIGN KEY (`docente_id`)
    REFERENCES `docente` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table: documentos
CREATE TABLE IF NOT EXISTS `documentos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(25) NOT NULL,
  `documento` VARCHAR(45) NOT NULL,
  `docente_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_documentos_tipo_numero` (`tipo` ASC, `documento` ASC) VISIBLE,
  INDEX `fk_documentos_docente1_idx` (`docente_id` ASC) VISIBLE,
  CONSTRAINT `fk_documentos_docente1`
    FOREIGN KEY (`docente_id`)
    REFERENCES `docente` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table: conta_bancaria
CREATE TABLE IF NOT EXISTS `conta_bancaria` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `banco` CHAR(3) NOT NULL,
  `agencia` VARCHAR(8) NOT NULL,
  `conta` VARCHAR(15) NOT NULL,
  `docente_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_conta_bancaria_docente_conta` (`docente_id` ASC, `banco` ASC, `agencia` ASC, `conta` ASC) VISIBLE,
  INDEX `fk_conta_bancaria_docente1_idx` (`docente_id` ASC) VISIBLE,
  CONSTRAINT `fk_conta_bancaria_docente1`
    FOREIGN KEY (`docente_id`)
    REFERENCES `docente` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table: usuario (authentication)
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(80) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `senha_hash` VARCHAR(255) NOT NULL,
  `ativo` BOOLEAN DEFAULT true,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_usuario_login` (`login` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- Table: sessao (authentication)
CREATE TABLE IF NOT EXISTS `sessao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `token_hash` CHAR(64) NOT NULL,
  `expira_em` DATETIME NOT NULL,
  `ip_origem` VARCHAR(45) NULL,
  `user_agent` VARCHAR(255) NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `uq_sessao_token_hash` (`token_hash` ASC) VISIBLE,
  INDEX `fk_sessao_usuario_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `idx_sessao_expira_em` (`expira_em` ASC) VISIBLE,
  CONSTRAINT `fk_sessao_usuario`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET SQL_MODE=@OLD_SQL_MODE;
