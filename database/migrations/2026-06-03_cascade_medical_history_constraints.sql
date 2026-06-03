ALTER TABLE antecedentes_familiares
  DROP FOREIGN KEY fk_af_historia,
  ADD CONSTRAINT fk_af_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE antecedentes_patologicos
  DROP FOREIGN KEY fk_ap_historia,
  ADD CONSTRAINT fk_ap_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE antecedentes_no_patologicos
  DROP FOREIGN KEY fk_antecedentes_np_historia,
  ADD CONSTRAINT fk_antecedentes_np_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE notas_evolucion
  DROP FOREIGN KEY fk_nota_historia,
  ADD CONSTRAINT fk_nota_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE aparatos_sistemas
  DROP FOREIGN KEY fk_as_historia,
  ADD CONSTRAINT fk_as_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  DROP FOREIGN KEY fk_as_nota,
  ADD CONSTRAINT fk_as_nota
    FOREIGN KEY (nota_evolucion_id) REFERENCES notas_evolucion(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE servicios
  DROP FOREIGN KEY fk_servicios_historia,
  ADD CONSTRAINT fk_servicios_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE inmunizaciones
  DROP FOREIGN KEY fk_inmu_historia,
  ADD CONSTRAINT fk_inmu_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE informacion_fisica
  DROP FOREIGN KEY fk_infoF_historia,
  ADD CONSTRAINT fk_infoF_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  DROP FOREIGN KEY fk_infoF_nota,
  ADD CONSTRAINT fk_infoF_nota
    FOREIGN KEY (nota_evolucion_id) REFERENCES notas_evolucion(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE planes_estudio
  DROP FOREIGN KEY fk_plan_historia,
  ADD CONSTRAINT fk_plan_historia
    FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  DROP FOREIGN KEY fk_plan_nota,
  ADD CONSTRAINT fk_plan_nota
    FOREIGN KEY (nota_evolucion_id) REFERENCES notas_evolucion(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE planes_estudio_cie10
  DROP FOREIGN KEY fk_cie10_plan,
  ADD CONSTRAINT fk_cie10_plan
    FOREIGN KEY (plan_estudio_id) REFERENCES planes_estudio(id)
    ON DELETE CASCADE ON UPDATE NO ACTION;
