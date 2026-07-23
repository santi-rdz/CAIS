-- CreateTable
CREATE TABLE `pacientes_areas` (
    `paciente_id` BINARY(16) NOT NULL,
    `area_id` INTEGER NOT NULL,
    `doctor_id` BINARY(16) NOT NULL,
    `creado_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_pa_area`(`area_id`),
    INDEX `fk_pa_doctor`(`doctor_id`),
    PRIMARY KEY (`paciente_id`, `area_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pacientes_areas` ADD CONSTRAINT `fk_pa_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pacientes_areas` ADD CONSTRAINT `fk_pa_area` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pacientes_areas` ADD CONSTRAINT `fk_pa_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Backfill: membresía inicial derivada del área del doctor que creó al paciente
INSERT INTO `pacientes_areas` (`paciente_id`, `area_id`, `doctor_id`, `creado_at`)
SELECT p.`id`, u.`area_id`, p.`doctor_id`, p.`creado_at`
FROM `pacientes` p
JOIN `usuarios` u ON p.`doctor_id` = u.`id`
WHERE u.`area_id` IS NOT NULL;
