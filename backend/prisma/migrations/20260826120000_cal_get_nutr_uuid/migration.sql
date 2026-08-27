-- cal_get_nutr.id: INT AUTO_INCREMENT → BINARY(16) UUID, para dejarlo consistente
-- con el resto de las evaluaciones de nutrición (id UUID). Es tabla hoja (ninguna
-- FK la referencia), así que reasignar ids no rompe relaciones.

ALTER TABLE `cal_get_nutr` MODIFY `id` INT NOT NULL;
ALTER TABLE `cal_get_nutr` DROP PRIMARY KEY;
ALTER TABLE `cal_get_nutr` MODIFY `id` BINARY(16) NOT NULL;
UPDATE `cal_get_nutr` SET `id` = (uuid_to_bin(uuid()));
ALTER TABLE `cal_get_nutr` MODIFY `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid()));
ALTER TABLE `cal_get_nutr` ADD PRIMARY KEY (`id`);
