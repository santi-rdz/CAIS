-- AlterTable
ALTER TABLE `reporte_een_adulto_nutricion` ADD COLUMN `apetito` VARCHAR(20) NULL,
    ADD COLUMN `cintura` FLOAT NULL,
    ADD COLUMN `estatura` FLOAT NULL,
    ADD COLUMN `peso` FLOAT NULL;

-- AlterTable
ALTER TABLE `reporte_een_kids_nutricion` ADD COLUMN `apetito` VARCHAR(20) NULL,
    ADD COLUMN `cintura` FLOAT NULL,
    ADD COLUMN `estatura` FLOAT NULL,
    ADD COLUMN `peso` FLOAT NULL;
