/*
  Warnings:

  - The primary key for the `reporte_een_adulto_nutricion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reporte_een_kids_nutricion` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `diagnostico_nutricional_adulto` DROP FOREIGN KEY `fk_reporte_diagnostico`;

-- AlterTable
ALTER TABLE `diagnostico_nutricional_adulto` MODIFY `reporte_een_id` BINARY(16) NOT NULL;

-- AlterTable
ALTER TABLE `reporte_een_adulto_nutricion` DROP PRIMARY KEY,
    ADD COLUMN `fecha_eval` DATE NULL DEFAULT (curdate()),
    MODIFY `id` BINARY(16) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `reporte_een_kids_nutricion` DROP PRIMARY KEY,
    ADD COLUMN `fecha_eval` DATE NULL DEFAULT (curdate()),
    MODIFY `id` BINARY(16) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `diagnostico_nutricional_adulto` ADD CONSTRAINT `fk_reporte_diagnostico` FOREIGN KEY (`reporte_een_id`) REFERENCES `reporte_een_adulto_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
