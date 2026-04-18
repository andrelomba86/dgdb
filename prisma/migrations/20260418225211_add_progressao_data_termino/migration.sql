/*
  Warnings:

  - You are about to drop the column `descricao` on the `progressao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `progressao` DROP FOREIGN KEY `cargo_docente_id_fkey`;

-- AlterTable
ALTER TABLE `progressao` DROP COLUMN `descricao`,
    ADD COLUMN `data_termino` DATE NULL;

-- AddForeignKey
ALTER TABLE `progressao` ADD CONSTRAINT `progressao_docente_id_fkey` FOREIGN KEY (`docente_id`) REFERENCES `docente`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RedefineIndex
CREATE INDEX `fk_progressao_docente1_idx` ON `progressao`(`docente_id`);
DROP INDEX `fk_cargo_docente1_idx` ON `progressao`;
