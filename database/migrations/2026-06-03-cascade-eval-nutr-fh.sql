ALTER TABLE eval_apetito_nutricion 
  ADD CONSTRAINT fk_apetito_eval_nutr 
    FOREIGN KEY (id_eval_nutr) REFERENCES eval_nutr_fh(id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE frec_consumo_alimentos_nutricion 
  ADD CONSTRAINT fk_consumo_eval_nutr 
    FOREIGN KEY (id_eval_nutr) REFERENCES eval_nutr_fh(id) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE horarios_comida_nutricion 
  ADD CONSTRAINT fk_horarios_eval_nutr 
    FOREIGN KEY (id_eval_nutr) REFERENCES eval_nutr_fh(id) ON DELETE CASCADE ON UPDATE NO ACTION;