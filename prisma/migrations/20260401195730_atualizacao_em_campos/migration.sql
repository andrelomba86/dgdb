-- AlterTable
ALTER TABLE `cargo` MODIFY `data_inicio` DATE NULL;

-- AlterTable
ALTER TABLE `docente` MODIFY `matricula` VARCHAR(10) NULL,
    MODIFY `email` VARCHAR(80) NULL,
    MODIFY `data_admissao` DATE NULL;
