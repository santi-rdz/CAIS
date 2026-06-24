-- Migración: campos de evaluación de monitoreo (sueño + actividad física)
-- Aplicar manualmente en la DB existente: pnpm run sql < database/002_eval_monitoreo.sql

ALTER TABLE eval_cal_sueno
  MODIFY COLUMN insomnio VARCHAR(10),
  MODIFY COLUMN medicacion VARCHAR(10),
  ADD COLUMN clasif_horas_sueno VARCHAR(20) NULL AFTER horas_sueno;

ALTER TABLE eval_act_fisica_nutricion
  ADD COLUMN clasif_tiempo_af VARCHAR(20) NULL AFTER intensidad;
