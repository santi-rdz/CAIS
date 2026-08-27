-- Normaliza los timestamps de sistema restantes: creado_at -> created_at.
-- CHANGE COLUMN preserva los valores existentes.

ALTER TABLE `pacientes_areas`
    CHANGE COLUMN `creado_at` `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

ALTER TABLE `eval_bioq_nutricion`
    CHANGE COLUMN `creado_at` `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

ALTER TABLE `eval_nutr_fh`
    CHANGE COLUMN `creado_at` `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

ALTER TABLE `invitaciones_registro`
    CHANGE COLUMN `creado_at` `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);

ALTER TABLE `password_reset_tokens`
    CHANGE COLUMN `creado_at` `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0);
