-- AlterTable
ALTER TABLE `invitaciones_registro` ADD COLUMN `area_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `fk_invitacion_area` ON `invitaciones_registro`(`area_id`);

-- AddForeignKey
ALTER TABLE `invitaciones_registro` ADD CONSTRAINT `fk_invitacion_area` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Backfill: las invitaciones pendientes heredan el área del creador (comportamiento previo)
UPDATE `invitaciones_registro` inv
JOIN `usuarios` u ON inv.`creado_por` = u.`id`
SET inv.`area_id` = u.`area_id`
WHERE inv.`area_id` IS NULL AND u.`area_id` IS NOT NULL;
