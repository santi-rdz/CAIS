-- Auditoría del sistema (created_at/updated_at/deleted_at) en los roots + soft
-- delete. Los campos de dominio mal nombrados `creado_at` (fecha de la historia
-- y de la nota) se renombran a `expedida_en` con CHANGE COLUMN (preserva datos).

-- usuarios
ALTER TABLE `usuarios`
    CHANGE COLUMN `creado_at` `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updated_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_at` DATETIME(0) NULL;

-- pacientes
ALTER TABLE `pacientes`
    CHANGE COLUMN `creado_at` `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    CHANGE COLUMN `actualizado_at` `updated_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_at` DATETIME(0) NULL;

-- historias_medicas (creado_at era la fecha de la historia -> expedida_en)
ALTER TABLE `historias_medicas`
    CHANGE COLUMN `creado_at` `expedida_en` DATE NULL DEFAULT (curdate()),
    ADD COLUMN `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updated_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_at` DATETIME(0) NULL;

-- notas_evolucion (creado_at era la fecha de la nota -> expedida_en)
ALTER TABLE `notas_evolucion`
    CHANGE COLUMN `creado_at` `expedida_en` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updated_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_at` DATETIME(0) NULL;

-- historias_pacientes_nutricion
ALTER TABLE `historias_pacientes_nutricion`
    ADD COLUMN `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updated_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_at` DATETIME(0) NULL;

-- bitacora_emergencias
ALTER TABLE `bitacora_emergencias`
    ADD COLUMN `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `updated_at` DATETIME(0) NULL,
    ADD COLUMN `deleted_at` DATETIME(0) NULL;
