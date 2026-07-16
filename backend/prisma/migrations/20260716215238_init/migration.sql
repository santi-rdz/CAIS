-- CreateTable
CREATE TABLE `acciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `codigo`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `adicciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `adicto_tabaco` VARCHAR(10) NULL,
    `tabaco_frecuencia` VARCHAR(20) NULL,
    `num_cigarros_d` TINYINT NULL,
    `adicto_alcohol` VARCHAR(10) NULL,
    `alcohol_frecuencia` VARCHAR(20) NULL,
    `ml_ocasion` SMALLINT NULL,
    `adicto_droga` VARCHAR(10) NULL,
    `drogas_frecuencia` VARCHAR(20) NULL,
    `cual_droga` TEXT NULL,
    `adicto_med_contr` VARCHAR(10) NULL,
    `med_contr_frecuencia` VARCHAR(20) NULL,
    `cual_med_contr` TEXT NULL,

    UNIQUE INDEX `historia_paciente_id`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `antecedentes_familiares` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_medica_id` BINARY(16) NOT NULL,
    `padre` VARCHAR(255) NULL,
    `madre` VARCHAR(255) NULL,
    `abuelo_paterno` VARCHAR(255) NULL,
    `abuelo_materno` VARCHAR(255) NULL,
    `abuela_paterna` VARCHAR(255) NULL,
    `abuela_materna` VARCHAR(255) NULL,
    `otros` VARCHAR(255) NULL,

    UNIQUE INDEX `historia_medica_id`(`historia_medica_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `antecedentes_no_patologicos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_medica_id` BINARY(16) NOT NULL,
    `alimentacion_adecuada` BOOLEAN NULL,
    `calidad_cantidad_alimentacion` TEXT NULL,
    `higiene_adecuada` TEXT NULL,
    `actividad_fisica` TEXT NULL,
    `inmunizaciones_completas` BOOLEAN NULL,
    `zoonosis` BOOLEAN NULL,
    `tipo_zoonosis` TEXT NULL,

    UNIQUE INDEX `historia_medica_id`(`historia_medica_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `antecedentes_patologicos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_medica_id` BINARY(16) NOT NULL,
    `cronico_degenerativos` TEXT NULL,
    `quirurgicos` TEXT NULL,
    `hospitalizaciones` TEXT NULL,
    `traumaticos` TEXT NULL,
    `transfusionales` TEXT NULL,
    `transplantes` TEXT NULL,
    `alergicos` TEXT NULL,
    `infectocontagiosos` TEXT NULL,
    `toxicomanias` TEXT NULL,
    `covid_19` TEXT NULL,
    `psicologia_psiquiatria` TEXT NULL,
    `gyo` TEXT NULL,
    `enfermedades_congenitas` TEXT NULL,
    `enfermedades_infancia` TEXT NULL,

    UNIQUE INDEX `historia_medica_id`(`historia_medica_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aparatos_sistemas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_medica_id` BINARY(16) NULL,
    `nota_evolucion_id` BINARY(16) NULL,
    `neurologico` TEXT NULL,
    `cardiovascular` TEXT NULL,
    `respiratorio` TEXT NULL,
    `hematologico` TEXT NULL,
    `digestivo` TEXT NULL,
    `musculoesqueletico` TEXT NULL,
    `genitourinario` TEXT NULL,
    `endocrinologico` TEXT NULL,
    `metabolico` TEXT NULL,
    `nutricional` TEXT NULL,

    UNIQUE INDEX `historia_medica_id`(`historia_medica_id`),
    UNIQUE INDEX `nota_evolucion_id`(`nota_evolucion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `areas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `entidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `nombre`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `codigo`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_act_fisica_nutricion` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha` DATE NULL DEFAULT (curdate()),
    `tipo` VARCHAR(50) NULL,
    `porque_no` TEXT NULL,
    `frecuencia` VARCHAR(20) NULL,
    `duracion` SMALLINT NULL,
    `intensidad` INTEGER NULL,
    `clasif_tiempo_af` VARCHAR(20) NULL,
    `tiempo_de_practica` VARCHAR(20) NULL,
    `pensamientos_con_realizar_AF` VARCHAR(50) NULL,

    INDEX `fk_eval_act_paciente`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_antro_ad_adulto_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eval_antro_id` BINARY(16) NOT NULL,
    `codo` FLOAT NULL,
    `frisancho` FLOAT NULL,
    `complexion` VARCHAR(20) NULL,
    `pi_kg` FLOAT NULL,
    `edema_liq` FLOAT NULL,
    `peso_sin_edema` FLOAT NULL,
    `peso_ajustado` FLOAT NULL,
    `peso_ideal_por` FLOAT NULL,
    `diagnostico_pi` VARCHAR(20) NULL,
    `diagnostico_imc` VARCHAR(20) NULL,
    `pcb` FLOAT NULL,
    `pcsi` FLOAT NULL,
    `riesgo_cv` BOOLEAN NULL,
    `cadera` FLOAT NULL,
    `indice_cintura_cadera` FLOAT NULL,
    `diagnostico_icc` VARCHAR(20) NULL,
    `circuf_cuello` FLOAT NULL,
    `riesgo_eo_inf` BOOLEAN NULL,

    UNIQUE INDEX `eval_antro_id`(`eval_antro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_antro_ad_kid_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eval_antro_id` BINARY(16) NOT NULL,
    `percentiles_imc` FLOAT NULL,
    `interpretacion_imc` VARCHAR(255) NULL,
    `percentiles_cintura` FLOAT NULL,
    `percentiles_pb` FLOAT NULL,
    `percentiles_pct` FLOAT NULL,
    `percentiles_pcse` FLOAT NULL,
    `peso_para_talla` FLOAT NULL,
    `peso_ideal` FLOAT NULL,
    `desviacion_estandar_peso` FLOAT NULL,
    `interpretacion_nom_peso` VARCHAR(50) NULL,
    `talla_para_edad` FLOAT NULL,
    `talla_ideal` FLOAT NULL,
    `desviacion_estandar_talla` FLOAT NULL,
    `interpretacion_nom_talla` VARCHAR(50) NULL,
    `peso_para_edad` FLOAT NULL,
    `desviacion_estandar_peso_edad` FLOAT NULL,
    `interpretacion_nom_peso_edad` VARCHAR(50) NULL,
    `diagnostico_general` VARCHAR(50) NULL,
    `resistencia` FLOAT NULL,
    `reactancia` FLOAT NULL,
    `angulo_fase` FLOAT NULL,
    `tan_angulo_fase` FLOAT NULL,

    UNIQUE INDEX `eval_antro_id`(`eval_antro_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_apetito_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_nutr` BINARY(16) NOT NULL,
    `apetito` VARCHAR(20) NULL,
    `lleno` VARCHAR(20) NULL,
    `sabor_comida` VARCHAR(20) NULL,
    `comidas_al_dia` VARCHAR(20) NULL,
    `puntaje_total` TINYINT NULL,
    `clasif_alteracion_apetito` VARCHAR(20) NULL,

    UNIQUE INDEX `id_eval_nutr`(`id_eval_nutr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_cal_sueno` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha` DATE NULL DEFAULT (curdate()),
    `horas_sueno` TINYINT NULL,
    `clasif_horas_sueno` VARCHAR(20) NULL,
    `insomnio` VARCHAR(10) NULL,
    `medicacion` VARCHAR(10) NULL,

    INDEX `fk_cal_sueno_paciente`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_perdida_peso_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_fis_id` BINARY(16) NOT NULL,
    `peso_habitual` FLOAT NULL,
    `peso_perdido` FLOAT NULL,
    `porcentaje_peso_perdido` FLOAT NULL,

    UNIQUE INDEX `exam_fis_id`(`exam_fis_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_semiologia_nutricional` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_fis_id` BINARY(16) NOT NULL,
    `pcb` VARCHAR(10) NULL,
    `pct` VARCHAR(10) NULL,
    `fondo_ojo` VARCHAR(10) NULL,
    `diag_reservagrasa` VARCHAR(10) NULL,
    `sienes` VARCHAR(10) NULL,
    `clavicula` VARCHAR(10) NULL,
    `hombros` VARCHAR(10) NULL,
    `omoplato` VARCHAR(10) NULL,
    `interoseos_mano` VARCHAR(10) NULL,
    `costillas` VARCHAR(10) NULL,
    `espalda_alta` VARCHAR(10) NULL,
    `cuadriceps` VARCHAR(10) NULL,
    `pantorrilla` VARCHAR(10) NULL,
    `diag_reserva_muscular` VARCHAR(15) NULL,
    `edema` VARCHAR(20) NULL,
    `descripcion` TEXT NULL,
    `descripcion_sist_genito_urinario` TEXT NULL,

    UNIQUE INDEX `exam_fis_id`(`exam_fis_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `frec_consumo_alimentos_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_nutr` BINARY(16) NOT NULL,
    `frutas` VARCHAR(20) NULL,
    `verduras_cocidas` VARCHAR(20) NULL,
    `verduras_crudas` VARCHAR(20) NULL,
    `pescado` VARCHAR(20) NULL,
    `mariscos` VARCHAR(20) NULL,
    `pollo` VARCHAR(20) NULL,
    `carne_roja` VARCHAR(20) NULL,
    `quesos` VARCHAR(20) NULL,
    `huevo_entero` VARCHAR(20) NULL,
    `clara_huevo` VARCHAR(20) NULL,
    `embutidos` VARCHAR(20) NULL,
    `leguminosas` VARCHAR(20) NULL,
    `tortilla_maiz` VARCHAR(20) NULL,
    `cant_tortilla_maiz` VARCHAR(20) NULL,
    `tortilla_harina` VARCHAR(20) NULL,
    `cant_tortilla_harina` VARCHAR(20) NULL,
    `pan_de_caja` VARCHAR(20) NULL,
    `galletas_industr` VARCHAR(20) NULL,
    `pan_dulce` VARCHAR(20) NULL,
    `cereal_de_caja` VARCHAR(20) NULL,
    `frituras_papas` VARCHAR(20) NULL,
    `birote_bolillo` VARCHAR(20) NULL,
    `pastas_arroz` VARCHAR(20) NULL,
    `aderezos_capsu` VARCHAR(20) NULL,
    `comida_rapida` VARCHAR(20) NULL,
    `grasa_animal` VARCHAR(20) NULL,
    `grasa_vegetal` VARCHAR(20) NULL,
    `cafe_te` VARCHAR(20) NULL,
    `litros_al_dia_cafe_te` VARCHAR(20) NULL,
    `bebida_az` VARCHAR(20) NULL,
    `litros_al_dia_beb_az` VARCHAR(20) NULL,
    `bebida_endul_art` VARCHAR(20) NULL,
    `litros_al_dia_beb_endul` VARCHAR(20) NULL,
    `leche_sin_az` VARCHAR(20) NULL,
    `litros_al_dia_leche_sin_az` VARCHAR(20) NULL,
    `agua_simple` VARCHAR(20) NULL,
    `litros_al_dia_agua_simple` VARCHAR(20) NULL,
    `agrega_sal_extra` VARCHAR(20) NULL,
    `cdas_al_dia_sal_extra` TINYINT NULL,
    `agrega_azucar` VARCHAR(20) NULL,
    `cdas_sobres_al_dia_azucar` TINYINT NULL,

    UNIQUE INDEX `id_eval_nutr`(`id_eval_nutr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historias_medicas` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `paciente_id` BINARY(16) NOT NULL,
    `usuario_id` BINARY(16) NOT NULL,
    `creado_at` DATE NULL DEFAULT (curdate()),
    `tipo_sangre` VARCHAR(5) NULL,
    `vacunas_infancia_completas` BOOLEAN NULL,
    `motivo_consulta` TEXT NULL,
    `historia_enfermedad_actual` TEXT NULL,

    INDEX `fk_historia_paciente`(`paciente_id`),
    INDEX `fk_historia_usuario`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historias_medicas_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `enfermedad` TEXT NULL,
    `evol` INTEGER NULL,
    `farmacos` TEXT NULL,
    `dosis` VARCHAR(20) NULL,

    INDEX `fk_historia_medica_historia_paciente`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historias_pacientes_nutricion` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `paciente_id` BINARY(16) NOT NULL,
    `fecha_ingreso` DATE NULL DEFAULT (curdate()),
    `motivo_consulta` TEXT NULL,

    INDEX `fk_historia_nutricion_paciente`(`paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `horarios_comida_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_nutr` BINARY(16) NOT NULL,
    `hora_desayuno` VARCHAR(20) NULL,
    `hora_comida` VARCHAR(20) NULL,
    `hora_cena` VARCHAR(20) NULL,
    `hora_colac_1` VARCHAR(20) NULL,
    `hora_colac_2` VARCHAR(20) NULL,
    `hora_colac_3` VARCHAR(20) NULL,
    `hora_despierto` VARCHAR(20) NULL,
    `tipo_alimentacion` VARCHAR(10) NULL,
    `problemas_masticar` BOOLEAN NULL,
    `problemas_pasar_alimento` BOOLEAN NULL,
    `perdida_dientes` BOOLEAN NULL,
    `pensamientos_sobre_dieta` TEXT NULL,

    UNIQUE INDEX `id_eval_nutr`(`id_eval_nutr`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `informacion_fisica` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_medica_id` BINARY(16) NULL,
    `nota_evolucion_id` BINARY(16) NULL,
    `peso` FLOAT NULL,
    `altura` FLOAT NULL,
    `pa_sistolica` INTEGER NULL,
    `pa_diastolica` INTEGER NULL,
    `fc` INTEGER NULL,
    `fr` INTEGER NULL,
    `circ_cintura` FLOAT NULL,
    `circ_cadera` FLOAT NULL,
    `sp_o2` FLOAT NULL,
    `glucosa_capilar` FLOAT NULL,
    `temperatura` FLOAT NULL,
    `exploracion_fisica` TEXT NULL,
    `habito_exterior` TEXT NULL,

    UNIQUE INDEX `historia_medica_id`(`historia_medica_id`),
    UNIQUE INDEX `nota_evolucion_id`(`nota_evolucion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inmunizaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_medica_id` BINARY(16) NOT NULL,
    `influenza` TIMESTAMP(0) NULL,
    `tetanos` TIMESTAMP(0) NULL,
    `hepatitis_b` TIMESTAMP(0) NULL,
    `covid_19` TIMESTAMP(0) NULL,
    `otros` TEXT NULL,

    UNIQUE INDEX `historia_medica_id`(`historia_medica_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notas_evolucion` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `historia_medica_id` BINARY(16) NOT NULL,
    `usuario_id` BINARY(16) NOT NULL,
    `motivo_consulta` TEXT NULL,
    `ant_gine_andro` TEXT NULL,
    `estudios_complementarios_efectuados` TEXT NULL,
    `creado_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_nota_historia`(`historia_medica_id`),
    INDEX `fk_nota_usuario`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pacientes` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `doctor_id` BINARY(16) NOT NULL,
    `nombre` VARCHAR(255) NULL,
    `apellidos` VARCHAR(255) NULL,
    `fecha_nacimiento` DATE NULL,
    `es_externo` BOOLEAN NULL DEFAULT false,
    `correo` VARCHAR(255) NULL,
    `telefono` VARCHAR(30) NULL,
    `genero` VARCHAR(20) NULL,
    `domicilio` VARCHAR(255) NULL,
    `fuente_informacion` VARCHAR(100) NULL,
    `lugar_nacimiento` VARCHAR(255) NULL,
    `ocupacion` VARCHAR(100) NULL,
    `estado_civil` VARCHAR(50) NULL,
    `nivel_educativo` VARCHAR(100) NULL,
    `religion` VARCHAR(100) NULL,
    `nss` VARCHAR(50) NULL,
    `curp_matricula` VARCHAR(50) NULL,
    `salario_dia` VARCHAR(20) NULL,
    `contacto_emergencia` VARCHAR(255) NULL,
    `telefono_emergencia` VARCHAR(30) NULL,
    `parentesco_emergencia` VARCHAR(100) NULL,
    `creado_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `actualizado_at` DATETIME(0) NULL,

    INDEX `fk_pacientes_usuario`(`doctor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planes_estudio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_medica_id` BINARY(16) NULL,
    `nota_evolucion_id` BINARY(16) NULL,
    `plan_tratamiento` TEXT NULL,
    `tratamiento` TEXT NULL,
    `estudios_complementarios` TEXT NULL,

    UNIQUE INDEX `historia_medica_id`(`historia_medica_id`),
    UNIQUE INDEX `nota_evolucion_id`(`nota_evolucion_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planes_estudio_cie10` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plan_estudio_id` INTEGER NOT NULL,
    `codigo` VARCHAR(10) NOT NULL,
    `descripcion` TEXT NULL,

    INDEX `fk_cie10_plan`(`plan_estudio_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `codigo`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_medica_id` BINARY(16) NOT NULL,
    `gas` BOOLEAN NULL,
    `luz` BOOLEAN NULL,
    `agua` BOOLEAN NULL,
    `drenaje` BOOLEAN NULL,
    `cable_tel` BOOLEAN NULL,
    `internet` BOOLEAN NULL,

    UNIQUE INDEX `historia_medica_id`(`historia_medica_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `signos_vitales_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_fis_id` BINARY(16) NOT NULL,
    `tas` FLOAT NULL,
    `tad` FLOAT NULL,
    `temperatura` FLOAT NULL,
    `dificultad_respiratoria` BOOLEAN NULL,

    UNIQUE INDEX `exam_fis_id`(`exam_fis_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tratamiento_alt_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `producto` TEXT NULL,
    `cual_producto` TEXT NULL,
    `mejora` VARCHAR(10) NULL,
    `dosis` VARCHAR(20) NULL,

    INDEX `fk_tratamiento_nutricion_historia_paciente`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `nombre` VARCHAR(255) NULL,
    `apellidos` VARCHAR(255) NULL,
    `fecha_nacimiento` DATE NULL,
    `correo` VARCHAR(255) NULL,
    `telefono` VARCHAR(30) NULL,
    `password_hash` VARCHAR(255) NULL,
    `estado_id` INTEGER NOT NULL,
    `rol_id` INTEGER NOT NULL,
    `area_id` INTEGER NULL,
    `creado_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ultimo_acceso` DATETIME(0) NULL,
    `foto` VARCHAR(255) NULL,
    `matricula` VARCHAR(20) NULL,
    `cedula` VARCHAR(20) NULL,
    `inicio_servicio` VARCHAR(8) NULL,
    `fin_servicio` VARCHAR(8) NULL,

    UNIQUE INDEX `correo`(`correo`),
    INDEX `fk_usuario_area`(`area_id`),
    INDEX `fk_usuario_estado`(`estado_id`),
    INDEX `fk_usuario_rol`(`rol_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `balance_acido_base` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_bioq` BINARY(16) NOT NULL,
    `ph_serico` FLOAT NULL,
    `saturacion_o2` FLOAT NULL,
    `bicarbonato` FLOAT NULL,
    `pco2_total` FLOAT NULL,

    UNIQUE INDEX `id_eval_bioq`(`id_eval_bioq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bitacora_emergencias` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `usuario_id` BINARY(16) NOT NULL,
    `fecha_hora` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ubicacion` VARCHAR(255) NOT NULL,
    `nombre` VARCHAR(255) NULL,
    `matricula` VARCHAR(20) NULL,
    `telefono` VARCHAR(30) NULL,
    `diagnostico` TEXT NULL,
    `accion_realizada` TEXT NULL,
    `tratamiento_admin` TEXT NULL,
    `recurrente` BOOLEAN NULL DEFAULT false,

    INDEX `fk_bitacora_usuario`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cal_get_nutr` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha_eval` DATE NULL DEFAULT (curdate()),
    `verdura` TINYINT NULL,
    `fruta` TINYINT NULL,
    `cereal_sin_grasa` TINYINT NULL,
    `cereal_con_grasa` TINYINT NULL,
    `leguminosas` TINYINT NULL,
    `aoa_a` TINYINT NULL,
    `aoa_b` TINYINT NULL,
    `aoa_c` TINYINT NULL,
    `aoa_d` TINYINT NULL,
    `leche_a` TINYINT NULL,
    `leche_b` TINYINT NULL,
    `leche_c` TINYINT NULL,
    `grasa_a` TINYINT NULL,
    `grasa_b` TINYINT NULL,
    `azucares` TINYINT NULL,
    `rice_dream` TINYINT NULL,
    `silk` TINYINT NULL,
    `soyactive` TINYINT NULL,
    `almond_breeze` TINYINT NULL,
    `aube_baja` TINYINT NULL,
    `nan_one` TINYINT NULL,
    `aube_alta` TINYINT NULL,

    INDEX `fk_cal_get_historia`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diagnostico_nutricional_adulto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reporte_een_id` INTEGER NOT NULL,
    `pes` TEXT NULL,
    `intervencion` VARCHAR(50) NULL,
    `objetivos` TEXT NULL,
    `indicadores` TEXT NULL,
    `criterio` TEXT NULL,
    `progreso` VARCHAR(20) NULL,

    INDEX `fk_reporte_diagnostico`(`reporte_een_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_antro_ad_nutricion` (
    `id` BINARY(16) NOT NULL,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha` DATE NULL DEFAULT (curdate()),
    `peso_actual` FLOAT NULL,
    `estatura` FLOAT NULL,
    `imc` FLOAT NULL,
    `pantorrilla` FLOAT NULL,
    `cintura` FLOAT NULL,
    `pb` FLOAT NULL,
    `pct` FLOAT NULL,
    `pcse` FLOAT NULL,

    INDEX `fk_eval_antro_historia`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_bioq_nutricion` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha` DATE NULL DEFAULT (curdate()),
    `creado_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_eval_bioq_historia_paciente`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_estado_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_bioq` BINARY(16) NOT NULL,
    `leucocitos` FLOAT NULL,
    `linfocitos` FLOAT NULL,
    `ctl` FLOAT NULL,
    `albumina` FLOAT NULL,
    `pre_albumina` FLOAT NULL,
    `transferrina` FLOAT NULL,

    UNIQUE INDEX `id_eval_bioq`(`id_eval_bioq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_nutr_fh` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha` DATE NULL DEFAULT (curdate()),
    `sigue_dieta` BOOLEAN NULL,
    `tiene_alergia` BOOLEAN NULL,
    `cual_alergia` TEXT NULL,
    `alimentos_disgusta` TEXT NULL,
    `creado_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_eval_nutr_historia_paciente`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eval_sintomas_gastroin_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_fis_id` BINARY(16) NOT NULL,
    `presenta_sgi` BOOLEAN NULL,
    `presencia` VARCHAR(50) NULL,

    INDEX `fk_exam_fis_sintomas`(`exam_fis_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_fis_orien_nutricion` (
    `id` BINARY(16) NOT NULL,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha` DATE NULL DEFAULT (curdate()),

    INDEX `fk_exam_fis_historia_paciente`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitaciones_registro` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `correo` VARCHAR(255) NOT NULL,
    `rol_id` INTEGER NOT NULL,
    `token` BINARY(16) NOT NULL,
    `usado` BOOLEAN NULL DEFAULT false,
    `expira_at` DATETIME(0) NOT NULL,
    `creado_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `creado_por` BINARY(16) NOT NULL,

    UNIQUE INDEX `correo`(`correo`),
    UNIQUE INDEX `token`(`token`),
    INDEX `fk_invitacion_creado_por`(`creado_por`),
    INDEX `fk_invitacion_rol`(`rol_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` BINARY(16) NOT NULL,
    `token` BINARY(16) NOT NULL,
    `usado` BOOLEAN NULL DEFAULT false,
    `expira_at` DATETIME(0) NOT NULL,
    `creado_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `token`(`token`),
    INDEX `idx_password_reset_usuario`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `patron_alimentacion_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha` DATE NULL,
    `sigue_dieta` BOOLEAN NULL,
    `tiene_alergia` BOOLEAN NULL,
    `cual_alergia` TEXT NULL,
    `alimentos_disgusta` TEXT NULL,

    INDEX `fk_patron_alimentacion_historia`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_anemia_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_bioq` BINARY(16) NOT NULL,
    `eritrocitos` FLOAT NULL,
    `hemoglobina` FLOAT NULL,
    `hematocrito` FLOAT NULL,
    `vcm` FLOAT NULL,
    `homocisteina` FLOAT NULL,
    `ferritina` FLOAT NULL,
    `hierro` FLOAT NULL,
    `cap_fij_tot_he` FLOAT NULL,
    `saturacion_hierro` FLOAT NULL,

    UNIQUE INDEX `id_eval_bioq`(`id_eval_bioq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_endocrino` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_bioq` BINARY(16) NOT NULL,
    `glucosa` FLOAT NULL,
    `hbAlc` FLOAT NULL,
    `insulina` FLOAT NULL,
    `tiroxina_libre` FLOAT NULL,
    `triyodotironina` FLOAT NULL,

    UNIQUE INDEX `id_eval_bioq`(`id_eval_bioq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_inflamatorio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_bioq` BINARY(16) NOT NULL,
    `pcr` FLOAT NULL,
    `plaquetas` INTEGER NULL,

    UNIQUE INDEX `id_eval_bioq`(`id_eval_bioq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_lipidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_bioq` BINARY(16) NOT NULL,
    `colesterol` FLOAT NULL,
    `c_hdl` FLOAT NULL,
    `c_ldl` FLOAT NULL,
    `trigliceridos` FLOAT NULL,

    UNIQUE INDEX `id_eval_bioq`(`id_eval_bioq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_orina` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_bioq` BINARY(16) NOT NULL,
    `volumen_urinario` FLOAT NULL,
    `densidad` FLOAT NULL,
    `alteraciones_urinarias` VARCHAR(20) NULL,
    `litos` VARCHAR(50) NULL,
    `ph` FLOAT NULL,
    `cetonas` VARCHAR(50) NULL,
    `sodio` SMALLINT NULL,

    UNIQUE INDEX `id_eval_bioq`(`id_eval_bioq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil_renal_electrolitos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_eval_bioq` BINARY(16) NOT NULL,
    `osmolaridad` FLOAT NULL,
    `urea` FLOAT NULL,
    `bun` FLOAT NULL,
    `creatinina` FLOAT NULL,
    `acido_urico` FLOAT NULL,
    `sodio` FLOAT NULL,
    `peso_sin_edema` FLOAT NULL,
    `agua` FLOAT NULL,
    `potasio` FLOAT NULL,
    `fosforo` FLOAT NULL,
    `calcio_serico` FLOAT NULL,
    `ca_corregido` FLOAT NULL,
    `producto_caP` FLOAT NULL,
    `pth` FLOAT NULL,
    `vitamina_d` FLOAT NULL,
    `tfge` FLOAT NULL,
    `albuminuria` FLOAT NULL,

    UNIQUE INDEX `id_eval_bioq`(`id_eval_bioq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rec_24h_comidas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rec_24h_id` BINARY(16) NOT NULL,
    `fecha` DATE NULL,
    `comida` VARCHAR(100) NULL,
    `grupo` VARCHAR(50) NULL,
    `alimento` VARCHAR(100) NULL,
    `calorias` FLOAT NULL,
    `grasa` FLOAT NULL,
    `colesterol` FLOAT NULL,
    `sodio` FLOAT NULL,
    `carb` FLOAT NULL,
    `proteinas` FLOAT NULL,
    `azucar` FLOAT NULL,
    `fibra` FLOAT NULL,

    INDEX `fk_comidas_rec_24h`(`rec_24h_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rec_24h_nutricion` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha_eval` DATE NULL DEFAULT (curdate()),
    `obj_calorias` FLOAT NULL,
    `obj_grasa` FLOAT NULL,
    `obj_colesterol` FLOAT NULL,
    `obj_sodio` FLOAT NULL,
    `obj_carb` FLOAT NULL,
    `obj_proteinas` FLOAT NULL,
    `obj_azucar` FLOAT NULL,
    `obj_fibra` FLOAT NULL,

    INDEX `fk_rec_24h_historia`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registro_auditoria` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `usuario_id` BINARY(16) NOT NULL,
    `accion_id` INTEGER NOT NULL,
    `entidad_id` INTEGER NOT NULL,
    `objetivo_id` BINARY(16) NULL,
    `paciente_id` BINARY(16) NULL,
    `fecha_hora` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_audit_accion`(`accion_id`),
    INDEX `fk_audit_entidad`(`entidad_id`),
    INDEX `fk_audit_usuario`(`usuario_id`),
    INDEX `idx_audit_objetivo`(`objetivo_id`),
    INDEX `idx_audit_paciente`(`paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporte_een_adulto_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `habitos_ali_obs` TEXT NULL,
    `alteraciones_gastroin` TEXT NULL,

    INDEX `fk_reporte_een_adulto_historia`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporte_een_kids_nutricion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `historia_paciente_id` BINARY(16) NOT NULL,
    `eval_diag_edo_nutr` TEXT NULL,
    `solicito_orient` BOOLEAN NULL,
    `prescrip_nut_obs` TEXT NULL,
    `educ_nut_obs` TEXT NULL,
    `consejeria_nut_obs` TEXT NULL,
    `coord_aten_nut_obs` TEXT NULL,

    INDEX `fk_reporte_een_kid_historia`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `sid` VARCHAR(255) NOT NULL,
    `data` TEXT NOT NULL,
    `expire` DATETIME(3) NOT NULL,

    INDEX `sessions_expire_idx`(`expire`),
    PRIMARY KEY (`sid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tpan_nutricion` (
    `id` BINARY(16) NOT NULL DEFAULT (uuid_to_bin(uuid())),
    `historia_paciente_id` BINARY(16) NOT NULL,
    `fecha_eval` DATE NULL DEFAULT (curdate()),
    `eval_realizada` TEXT NULL,
    `observacion` TEXT NULL,
    `estandares_com` TEXT NULL,
    `decision` TEXT NULL,
    `problema_iden` TEXT NULL,
    `causa_probl` TEXT NULL,
    `evidencia_probl` TEXT NULL,
    `progreso` TINYINT NULL,

    INDEX `fk_tpan_historia_paciente`(`historia_paciente_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `adicciones` ADD CONSTRAINT `fk_adicciones_historia_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `antecedentes_familiares` ADD CONSTRAINT `fk_af_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `antecedentes_no_patologicos` ADD CONSTRAINT `fk_antecedentes_np_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `antecedentes_patologicos` ADD CONSTRAINT `fk_ap_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `aparatos_sistemas` ADD CONSTRAINT `fk_as_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `aparatos_sistemas` ADD CONSTRAINT `fk_as_nota` FOREIGN KEY (`nota_evolucion_id`) REFERENCES `notas_evolucion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_act_fisica_nutricion` ADD CONSTRAINT `fk_eval_act_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_antro_ad_adulto_nutricion` ADD CONSTRAINT `fk_eval_antro_ad_adulto` FOREIGN KEY (`eval_antro_id`) REFERENCES `eval_antro_ad_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_antro_ad_kid_nutricion` ADD CONSTRAINT `fk_eval_antro_ad_kid` FOREIGN KEY (`eval_antro_id`) REFERENCES `eval_antro_ad_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_apetito_nutricion` ADD CONSTRAINT `fk_apetito_eval_nutr` FOREIGN KEY (`id_eval_nutr`) REFERENCES `eval_nutr_fh`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_cal_sueno` ADD CONSTRAINT `fk_cal_sueno_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_perdida_peso_nutricion` ADD CONSTRAINT `fk_perdida_peso_exam_fis` FOREIGN KEY (`exam_fis_id`) REFERENCES `exam_fis_orien_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_semiologia_nutricional` ADD CONSTRAINT `fk_semiologia_exam_fis` FOREIGN KEY (`exam_fis_id`) REFERENCES `exam_fis_orien_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `frec_consumo_alimentos_nutricion` ADD CONSTRAINT `fk_consumo_eval_nutr` FOREIGN KEY (`id_eval_nutr`) REFERENCES `eval_nutr_fh`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `historias_medicas` ADD CONSTRAINT `fk_historia_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `historias_medicas` ADD CONSTRAINT `fk_historia_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `historias_medicas_nutricion` ADD CONSTRAINT `fk_historia_medica_historia_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `historias_pacientes_nutricion` ADD CONSTRAINT `fk_historia_nutricion_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `horarios_comida_nutricion` ADD CONSTRAINT `fk_horarios_eval_nutr` FOREIGN KEY (`id_eval_nutr`) REFERENCES `eval_nutr_fh`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `informacion_fisica` ADD CONSTRAINT `fk_infoF_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `informacion_fisica` ADD CONSTRAINT `fk_infoF_nota` FOREIGN KEY (`nota_evolucion_id`) REFERENCES `notas_evolucion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `inmunizaciones` ADD CONSTRAINT `fk_inmu_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notas_evolucion` ADD CONSTRAINT `fk_nota_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notas_evolucion` ADD CONSTRAINT `fk_nota_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pacientes` ADD CONSTRAINT `fk_pacientes_usuario` FOREIGN KEY (`doctor_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `planes_estudio` ADD CONSTRAINT `fk_plan_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `planes_estudio` ADD CONSTRAINT `fk_plan_nota` FOREIGN KEY (`nota_evolucion_id`) REFERENCES `notas_evolucion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `planes_estudio_cie10` ADD CONSTRAINT `fk_cie10_plan` FOREIGN KEY (`plan_estudio_id`) REFERENCES `planes_estudio`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `servicios` ADD CONSTRAINT `fk_servicios_historia` FOREIGN KEY (`historia_medica_id`) REFERENCES `historias_medicas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `signos_vitales_nutricion` ADD CONSTRAINT `fk_signos_vitales_exam_fis` FOREIGN KEY (`exam_fis_id`) REFERENCES `exam_fis_orien_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tratamiento_alt_nutricion` ADD CONSTRAINT `fk_tratamiento_nutricion_historia_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuario_area` FOREIGN KEY (`area_id`) REFERENCES `areas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuario_estado` FOREIGN KEY (`estado_id`) REFERENCES `estados`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `balance_acido_base` ADD CONSTRAINT `fk_eval_bioq_balance` FOREIGN KEY (`id_eval_bioq`) REFERENCES `eval_bioq_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bitacora_emergencias` ADD CONSTRAINT `fk_bitacora_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cal_get_nutr` ADD CONSTRAINT `fk_cal_get_historia` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `diagnostico_nutricional_adulto` ADD CONSTRAINT `fk_reporte_diagnostico` FOREIGN KEY (`reporte_een_id`) REFERENCES `reporte_een_adulto_nutricion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_antro_ad_nutricion` ADD CONSTRAINT `fk_eval_antro_historia` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_bioq_nutricion` ADD CONSTRAINT `fk_eval_bioq_historia_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_estado_nutricion` ADD CONSTRAINT `fk_eval_bioq_estado_nutr` FOREIGN KEY (`id_eval_bioq`) REFERENCES `eval_bioq_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_nutr_fh` ADD CONSTRAINT `fk_eval_nutr_historia_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `eval_sintomas_gastroin_nutricion` ADD CONSTRAINT `fk_exam_fis_sintomas` FOREIGN KEY (`exam_fis_id`) REFERENCES `exam_fis_orien_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `exam_fis_orien_nutricion` ADD CONSTRAINT `fk_exam_fis_historia_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `invitaciones_registro` ADD CONSTRAINT `fk_invitacion_creado_por` FOREIGN KEY (`creado_por`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `invitaciones_registro` ADD CONSTRAINT `fk_invitacion_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `password_reset_tokens` ADD CONSTRAINT `fk_password_reset_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `patron_alimentacion_nutricion` ADD CONSTRAINT `fk_patron_alimentacion_historia` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `perfil_anemia_nutricion` ADD CONSTRAINT `fk_eval_bioq_anemia` FOREIGN KEY (`id_eval_bioq`) REFERENCES `eval_bioq_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `perfil_endocrino` ADD CONSTRAINT `fk_eval_bioq_endocrino` FOREIGN KEY (`id_eval_bioq`) REFERENCES `eval_bioq_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `perfil_inflamatorio` ADD CONSTRAINT `fk_eval_bioq_inflamatorio` FOREIGN KEY (`id_eval_bioq`) REFERENCES `eval_bioq_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `perfil_lipidos` ADD CONSTRAINT `fk_eval_bioq_lipidos` FOREIGN KEY (`id_eval_bioq`) REFERENCES `eval_bioq_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `perfil_orina` ADD CONSTRAINT `fk_eval_bioq_orina` FOREIGN KEY (`id_eval_bioq`) REFERENCES `eval_bioq_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `perfil_renal_electrolitos` ADD CONSTRAINT `fk_eval_bioq_renal` FOREIGN KEY (`id_eval_bioq`) REFERENCES `eval_bioq_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rec_24h_comidas` ADD CONSTRAINT `fk_comidas_rec_24h` FOREIGN KEY (`rec_24h_id`) REFERENCES `rec_24h_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rec_24h_nutricion` ADD CONSTRAINT `fk_rec_24h_historia` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `registro_auditoria` ADD CONSTRAINT `fk_audit_accion` FOREIGN KEY (`accion_id`) REFERENCES `acciones`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `registro_auditoria` ADD CONSTRAINT `fk_audit_entidad` FOREIGN KEY (`entidad_id`) REFERENCES `entidades`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `registro_auditoria` ADD CONSTRAINT `fk_audit_paciente` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `registro_auditoria` ADD CONSTRAINT `fk_audit_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reporte_een_adulto_nutricion` ADD CONSTRAINT `fk_reporte_een_adulto_historia` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reporte_een_kids_nutricion` ADD CONSTRAINT `fk_reporte_een_kid_historia` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tpan_nutricion` ADD CONSTRAINT `fk_tpan_historia_paciente` FOREIGN KEY (`historia_paciente_id`) REFERENCES `historias_pacientes_nutricion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
