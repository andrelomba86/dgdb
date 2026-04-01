-- CreateTable
CREATE TABLE `docente` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `endereco` VARCHAR(200) NULL,
    `data_nascimento` DATE NULL,
    `matricula` VARCHAR(10) NOT NULL,
    `email` VARCHAR(80) NOT NULL,
    `data_admissao` DATE NOT NULL,
    `regime_juridico` VARCHAR(15) NULL,
    `regime_trabalho` VARCHAR(15) NULL,
    `regime_data_aplicacao` DATE NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `uq_docente_matricula`(`matricula`),
    UNIQUE INDEX `uq_docente_email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cargo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `descricao` VARCHAR(60) NOT NULL,
    `funcao` VARCHAR(60) NULL,
    `data_inicio` DATE NOT NULL,
    `referencia` VARCHAR(45) NULL,
    `docente_id` INTEGER NOT NULL,

    INDEX `fk_cargo_docente1_idx`(`docente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `telefone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `telefone` VARCHAR(15) NOT NULL,
    `tipo` VARCHAR(20) NOT NULL,
    `docente_id` INTEGER NOT NULL,

    INDEX `fk_telefone_docentes1_idx`(`docente_id`),
    UNIQUE INDEX `uq_telefone_docente_numero`(`docente_id`, `telefone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo` VARCHAR(25) NOT NULL,
    `documento` VARCHAR(45) NOT NULL,
    `docente_id` INTEGER NOT NULL,

    INDEX `fk_documentos_docente1_idx`(`docente_id`),
    UNIQUE INDEX `uq_documentos_tipo_numero`(`tipo`, `documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conta_bancaria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `banco` CHAR(3) NOT NULL,
    `agencia` VARCHAR(8) NOT NULL,
    `conta` VARCHAR(15) NOT NULL,
    `docente_id` INTEGER NOT NULL,

    INDEX `fk_conta_bancaria_docente1_idx`(`docente_id`),
    UNIQUE INDEX `uq_conta_bancaria_docente_conta`(`docente_id`, `banco`, `agencia`, `conta`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `login` VARCHAR(80) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `senha_hash` VARCHAR(255) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizado_em` DATETIME(3) NOT NULL,

    UNIQUE INDEX `uq_usuario_login`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token_hash` CHAR(64) NOT NULL,
    `expira_em` DATETIME(3) NOT NULL,
    `ip_origem` VARCHAR(45) NULL,
    `user_agent` VARCHAR(255) NULL,
    `criado_em` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuario_id` INTEGER NOT NULL,

    UNIQUE INDEX `uq_sessao_token_hash`(`token_hash`),
    INDEX `fk_sessao_usuario_idx`(`usuario_id`),
    INDEX `idx_sessao_expira_em`(`expira_em`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cargo` ADD CONSTRAINT `cargo_docente_id_fkey` FOREIGN KEY (`docente_id`) REFERENCES `docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `telefone` ADD CONSTRAINT `telefone_docente_id_fkey` FOREIGN KEY (`docente_id`) REFERENCES `docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documentos` ADD CONSTRAINT `documentos_docente_id_fkey` FOREIGN KEY (`docente_id`) REFERENCES `docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conta_bancaria` ADD CONSTRAINT `conta_bancaria_docente_id_fkey` FOREIGN KEY (`docente_id`) REFERENCES `docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessao` ADD CONSTRAINT `sessao_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
