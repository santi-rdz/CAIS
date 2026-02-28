-- ===============================
-- TABLAS BASE (SIN DEPENDENCIAS)
-- ===============================
CREATE TABLE IF NOT EXISTS estados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS acciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS entidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- ===============================
-- USUARIOS
-- ===============================
CREATE TABLE IF NOT EXISTS usuarios (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    nombre VARCHAR(255),
    fecha_nacimiento DATE,
    correo VARCHAR(255) UNIQUE,
    telefono VARCHAR(30),
    password_hash VARCHAR(255),
    estado_id INT NOT NULL,
    rol_id INT NOT NULL,
    area_id INT NULL,
    creado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso DATETIME DEFAULT NULL,
    foto VARCHAR(255) DEFAULT NULL,
    matricula VARCHAR(20) DEFAULT NULL,
    inicio_servicio VARCHAR(8) DEFAULT NULL,
    fin_servicio VARCHAR(8) DEFAULT NULL,
    CONSTRAINT fk_usuario_estado FOREIGN KEY (estado_id) REFERENCES estados(id),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (rol_id) REFERENCES roles(id),
    CONSTRAINT fk_usuario_area FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- ===============================
-- PACIENTES
-- ===============================
CREATE TABLE IF NOT EXISTS pacientes (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    doctor_id BINARY(16) NOT NULL,
    nombre VARCHAR(255),
    fecha_nacimiento DATE,
    es_externo BOOLEAN DEFAULT FALSE,
    correo VARCHAR(255),
    telefono VARCHAR(30),
    genero VARCHAR(20),
    domicilio VARCHAR(255),
    ocupacion VARCHAR(100),
    estado_civil VARCHAR(50),
    nivel_educativo VARCHAR(100),
    religion VARCHAR(100),
    nss VARCHAR(50),
    contacto_emergencia VARCHAR(255),
    telefono_emergencia VARCHAR(30),
    parentesco_emergencia VARCHAR(100),
    creado_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pacientes_usuario FOREIGN KEY (doctor_id) REFERENCES usuarios(id)
);

-- ===============================
-- TABLAS MÉDICAS SIN FK
-- ===============================
CREATE TABLE IF NOT EXISTS antecedentes_familiares (
    id INT AUTO_INCREMENT PRIMARY KEY,
    padre VARCHAR(255),
    madre VARCHAR(255),
    abuelo_paterno VARCHAR(255),
    abuelo_materno VARCHAR(255),
    abuela_paterna VARCHAR(255),
    abuela_materna VARCHAR(255),
    otros VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS antecedentes_patologicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cronico_degenerativos TEXT,
    quirurgicos TEXT,
    hospitalizaciones TEXT,
    traumaticos TEXT,
    transfusionales TEXT,
    transplantes TEXT,
    alergicos TEXT,
    infectocontagiosos TEXT,
    toxicomanias TEXT,
    covid_19 TEXT,
    psicologia_psiquiatria TEXT,
    gyo TEXT,
    enfermedades_congenitas TEXT,
    enfermedades_infancia TEXT
);

CREATE TABLE IF NOT EXISTS aparatos_sistemas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    neurologico TEXT,
    cardiovascular TEXT,
    respiratorio TEXT,
    hematologico TEXT,
    digestivo TEXT,
    musculoesqueletico TEXT,
    genitourinario TEXT,
    endocrinologico TEXT,
    metabolico TEXT,
    nutricional TEXT
);

CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gas BOOLEAN,
    luz BOOLEAN,
    agua BOOLEAN,
    drenaje BOOLEAN,
    cable_tel BOOLEAN,
    internet BOOLEAN
);

CREATE TABLE IF NOT EXISTS inmunizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    influenza TIMESTAMP NULL,
    tetanos TIMESTAMP NULL,
    hepatitis_b TIMESTAMP NULL,
    covid_19 TIMESTAMP NULL,
    otros TEXT
);

CREATE TABLE IF NOT EXISTS informacion_fisica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    peso FLOAT NOT NULL,
    altura FLOAT NOT NULL,
    pa_sistolica INT NOT NULL,
    pa_diastolica INT NOT NULL,
    fc INT NOT NULL,
    fr INT NOT NULL,
    circ_cintura FLOAT NOT NULL,
    circ_cadera FLOAT NOT NULL,
    sp_o2 FLOAT NOT NULL,
    glucosa_capilar FLOAT NOT NULL,
    temperatura FLOAT NOT NULL,
    exploracion_fisica TEXT,
    habito_exterior TEXT
);

CREATE TABLE IF NOT EXISTS planes_estudio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_cie10 VARCHAR(50) NOT NULL,
    plan_tratamiento TEXT,
    usuario_id BINARY(16) NOT NULL,
    generado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    tratamiento TEXT,
    CONSTRAINT fk_plan_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ===============================
-- TABLAS NUTRICIÓN SIN FK
-- ===============================
CREATE TABLE IF NOT EXISTS adicciones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    adicto_tabaco VARCHAR(10),
    tabaco_frecuencia VARCHAR(20),
    num_cigarros_d TINYINT,
    adicto_alcohol VARCHAR(10),
    alcohol_frecuencia VARCHAR(20),
    ml_ocasion SMALLINT,
    adicto_droga VARCHAR(10),
    drogas_frecuencia VARCHAR(20),
    cual_droga TEXT,
    adicto_med_contr VARCHAR(10),
    med_contr_frecuencia VARCHAR(20),
    cual_med_contr TEXT
);

CREATE TABLE IF NOT EXISTS perfil_anemia_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    eritrocitos FLOAT, 
    hemoglobina FLOAT, 
    hematocrito FLOAT,
    vcm FLOAT,
    homocisteina FLOAT,
    ferritina FLOAT,
    hierro FLOAT,
    cap_fij_tot_he FLOAT,
    saturacion_hierro FLOAT
);

CREATE TABLE IF NOT EXISTS perfil_endocrino(
    id INT AUTO_INCREMENT PRIMARY KEY,
    glucosa FLOAT,
    hbAlc FLOAT,
    insulina FLOAT,
    tiroxina_libre FLOAT,
    triyodotironina FLOAT
);

CREATE TABLE IF NOT EXISTS perfil_renal_electrolitos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    osmolaridad FLOAT, --calculo
    urea FLOAT,
    bun FLOAT,
    creatinina FLOAT,
    acido_urico FLOAT,
    sodio FLOAT,
    peso_sin_edema FLOAT,
    agua FLOAT, --calculo
    potasio FLOAT,
    fosforo FLOAT,
    calcio_serico FLOAT,
    ca_corregido FLOAT, --calculo
    producto_caP FLOAT, --calculo
    pth FLOAT,
    vitamina_d FLOAT,
    tfge FLOAT,
    albuminuria FLOAT
);

CREATE TABLE IF NOT EXISTS perfil_lipidos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    colesterol FLOAT,
    c_hdl FLOAT,
    c_ldl FLOAT,
    trigliceridos FLOAT
);

CREATE TABLE IF NOT EXISTS balance_acido_base(
    id INT AUTO_INCREMENT PRIMARY KEY,
    ph_serico FLOAT,
    saturacion_o2 FLOAT,
    bicarbonato FLOAT,
    pco2_total FLOAT
);

CREATE TABLE IF NOT EXISTS perfil_orina(
    id INT AUTO_INCREMENT PRIMARY KEY,
    volumen_urinario FLOAT,
    densidad FLOAT,
    alteraciones_urinarias VARCHAR(20),
    litos VARCHAR(50),
    ph FLOAT,
    cetonas VARCHAR(50),
    sodio SMALLINT
);

CREATE TABLE IF NOT EXISTS perfil_inflamatorio(
    id INT AUTO_INCREMENT PRIMARY KEY,
    pcr FLOAT,
    plaquetas INT
);

CREATE TABLE IF NOT EXISTS eval_estado_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    leucocitos FLOAT,
    linfocitos FLOAT,
    ctl FLOAT, --calculo
    albumina FLOAT,
    pre_albumina FLOAT,
    transferrina FLOAT
);

CREATE TABLE IF NOT EXISTS horarios_comida_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    hora_desayuno VARCHAR(20),
    hora_comida VARCHAR(20),
    hora_cena VARCHAR(20),
    hora_colac_1 VARCHAR(20),
    hora_colac_2 VARCHAR(20),
    hora_colac_3 VARCHAR(20),
    hora_despierto VARCHAR(20),
    tipo_alimentacion VARCHAR(10),
    problemas_masticar BOOLEAN,
    problemas_pasar_alimento BOOLEAN,
    perdida_dientes BOOLEAN,
    pensamientos_sobre_dieta VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS eval_apetito_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    apetito VARCHAR(20),
    lleno VARCHAR(20),
    sabor_comida VARCHAR(20),
    comidas_al_día VARCHAR(20),
    puntaje_total TINYINT,
    clasif_alteración_apetito VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS frec_consumo_alimentos_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    frutas VARCHAR(20),
    verduras_cocidas VARCHAR(20),
    verduras_crudas VARCHAR(20),
    pesacado VARCHAR(20),
    mariscos VARCHAR(20),
    pollo VARCHAR(20),
    carne_roja VARCHAR(20),
    quesos VARCHAR(20),
    huevo_entero VARCHAR(20),
    clara_huevo VARCHAR(20),
    embutidos VARCHAR(20),
    leguminosas VARCHAR(20),
    tortilla_maíz VARCHAR(20),
    cant_tortilla_maiz VARCHAR(20),
    tortilla_harina VARCHAR(20),
    cant_tortilla_harina VARCHAR(20),
    pan_de_caja VARCHAR(20),
    galletas_industr VARCHAR(20),
    pan_dulce VARCHAR(20),
    cereal_de_caja VARCHAR(20),
    frituras_papas VARCHAR(20),
    birote_bolillo VARCHAR(20),
    pastas_arroz VARCHAR(20),
    aderezos_capsu VARCHAR(20),
    comida_rapida VARCHAR(20),
    grasa_animal VARCHAR(20),
    grasa_vegetal VARCHAR(20),
    cafe_te VARCHAR(20),
    litros_al_dia_cafe_te VARCHAR(20),
    bebida_az VARCHAR(20),
    litros_al_dia_beb_az VARCHAR(20),
    bebida_endul_art VARCHAR(20),
    litros_al_dia_beb_endul VARCHAR(20),
    leche_sin_az VARCHAR(20),
    litros_al_dia_leche_sin_az VARCHAR(20),
    agua_simple VARCHAR(20),
    litros_al_dia_agua_simple VARCHAR(20),
    agrega_sal_extra VARCHAR(20),
    cdas_al_dia_sal_extra TINYINT,
    agrega_azucar VARCHAR(20),
    cdas_sobres_al_dia_azucar TINYINT
);

CREATE TABLE IF NOT EXISTS eval_perdida_peso_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    peso_habitual FLOAT,
    peso_perdido FLOAT,
    porcentaje_peso_perdido FLOAT, --calculo
);

CREATE TABLE IF NOT EXISTS signos_vitales_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    tas	FLOAT,
    tad	FLOAT,
    temperatura	FLOAT,
    dificultad_respiratoria BOOLEAN
);

CREATE TABLE IF NOT EXISTS eval_semiologia_nutricional(
    id INT AUTO_INCREMENT PRIMARY KEY,
    pcb VARCHAR(10),	
    pct VARCHAR(10),	
    fondo_ojo VARCHAR(10),	
    diag_reservagrasa VARCHAR(10),	
    sienes VARCHAR(10),	
    clavicula VARCHAR(10),	
    hombros VARCHAR(10),	
    omoplato VARCHAR(10),	
    interoseos_mano VARCHAR(10),	
    costillas VARCHAR(10),	
    espalda_alta VARCHAR(10),	
    cuadriceps VARCHAR(10),	
    pantorrilla VARCHAR(10),	
    diag_reserva_muscular VARCHAR(15),	
    edema VARCHAR(20),
    descripcion TEXT, -- descripcion de lo que observa el paciente en su cuerpo
    descripcion_sist_genito_urinario TEXT   -- descripcion de lo que observa el paciente en base al sistema genito_urinario
);

CREATE TABLE IF NOT EXISTS eval_antro_ad_kid_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
	percentiles_imc FLOAT,
	interpretacion_imc VARCHAR(255),
	percentiles_cintura FLOAT,
	percentiles_pb FLOAT,
	percentiles_pct FLOAT,
	percentiles_pcse FLOAT,
	peso_para_talla FLOAT,
	peso_ideal FLOAT,
	desviacion_estandar_peso FLOAT,
	interpretacion_nom_peso VARCHAR(50),
	talla_para_edad FLOAT,
	talla_ideal FLOAT,
	desviacion_estandar_talla FLOAT,
	interpretacion_nom_talla VARCHAR(50),
	peso_para_edad FLOAT,
	desviacion_estandar_peso_edad FLOAT,
	interpretacion_nom_peso_edad VARCHAR(50),
	diagnostico_general VARCHAR(50),
    --ANALISIS VECTORIAL
    resistencia FLOAT,
    reactancia FLOAT,
    angulo_fase FLOAT,
    tan_angulo_fase FLOAT
);

CREATE TABLE IF NOT EXISTS eval_antro_ad_adulto_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
	codo FLOAT,
	frisancho FLOAT,
	complexion VARCHAR(20),
	pi_kg FLOAT,
	edema_liq FLOAT,
	peso_sin_edema FLOAT,
	peso_ajustado FLOAT,
	peso_ideal_por FLOAT,
	diagnostico_pi VARCHAR(20),
	diagnostico_imc VARCHAR(20),
	pcb FLOAT,
	pcsi FLOAT,
	riesgo_cv BOOLEAN,
	cadera FLOAT,
	indice_cintura_cadera FLOAT,
	diagnostico_icc VARCHAR(20),
	circuf_cuello FLOAT,
	riesgo_eo_inf BOOLEAN
);

-- ===============================
-- HISTORIA CLÍNICA
-- ===============================
CREATE TABLE IF NOT EXISTS historias_medicas (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    antecedentes_familiares_id INT,
    antecedentes_patologicos_id INT,
    servicios_id INT,
    inmunizaciones_id INT,
    informacion_fisica_id INT,
    aparatos_sistemas_id INT,
    plan_estudio_id INT,
    tipo_sangre VARCHAR(5),
    vacunas_infancia_completas BOOLEAN,
    motivo_consulta TEXT,
    historia_enfermedad_actual TEXT,
    CONSTRAINT fk_historia_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_historia_af FOREIGN KEY (antecedentes_familiares_id) REFERENCES antecedentes_familiares(id),
    CONSTRAINT fk_historia_ap FOREIGN KEY (antecedentes_patologicos_id) REFERENCES antecedentes_patologicos(id),
    CONSTRAINT fk_historia_serv FOREIGN KEY (servicios_id) REFERENCES servicios(id),
    CONSTRAINT fk_historia_inm FOREIGN KEY (inmunizaciones_id) REFERENCES inmunizaciones(id),
    CONSTRAINT fk_historia_info FOREIGN KEY (informacion_fisica_id) REFERENCES informacion_fisica(id),
    CONSTRAINT fk_historia_as FOREIGN KEY (aparatos_sistemas_id) REFERENCES aparatos_sistemas(id),
    CONSTRAINT fk_historia_plan FOREIGN KEY (plan_estudio_id) REFERENCES planes_estudio(id)
);

CREATE TABLE IF NOT EXISTS notas_evolucion (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    historia_medica_id BINARY(16),
    paciente_id BINARY(16),
    motivo_consulta TEXT,
    ant_gine_andro TEXT,
    aparatos_sistemas_id INT,
    informacion_fisica_id INT,
    plan_estudio_id INT,
    CONSTRAINT fk_nota_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_nota_historia FOREIGN KEY (historia_medica_id) REFERENCES historias_medicas(id),
    CONSTRAINT fk_nota_as FOREIGN KEY (aparatos_sistemas_id) REFERENCES aparatos_sistemas(id),
    CONSTRAINT fk_nota_info FOREIGN KEY (informacion_fisica_id) REFERENCES informacion_fisica(id),
    CONSTRAINT fk_nota_plan FOREIGN KEY (plan_estudio_id) REFERENCES planes_estudio(id)
);

-- ===============================
-- HISTORIA CLÍNICA (NUTRICION)
-- ===============================
CREATE TABLE IF NOT EXISTS historias_pacientes_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    motivo_consulta TEXT,
    adicciones_id INT,
    CONSTRAINT fk_historia_nutricion_paciente FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_historia_nutricion_adiccion FOREIGN KEY (adicciones_id) REFERENCES adicciones(id)
);

CREATE TABLE IF NOT EXISTS historias_medicas_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY, 
    historia_paciente_id BINARY(16) NOT NULL,
    enfermedad TEXT,
    evol INT,
    farmacos TEXT,
    dosis VARCHAR(20),
    CONSTRAINT fk_historia_medica_historia_paciente FOREIGN KEY (historia_paciente_id) REFERENCES historias_pacientes_nutricion(id)
);

CREATE TABLE IF NOT EXISTS tratamiento_alt_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY, 
    historia_paciente_id BINARY(16) NOT NULL,
    producto TEXT,
    cual_producto TEXT, 
    mejora VARCHAR(10),
    dosis VARCHAR(20),
    CONSTRAINT fk_tratamiento_nutricion_historia_paciente FOREIGN KEY (historia_paciente_id) REFERENCES historias_pacientes_nutricion(id)
);

CREATE TABLE IF NOT EXISTS eval_cal_sueno(
    id INT AUTO_INCREMENT PRIMARY KEY,
    historia_paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE, 
    horas_sueno TINYINT,
    insomnio TINYINT,
    medicacion TINYINT,
    CONSTRAINT fk_cal_sueno_paciente FOREIGN KEY (historia_paciente_id) REFERENCES historias_pacientes_nutricion(id)
)

CREATE TABLE IF NOT EXISTS eval_act_fisica_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    historia_paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    tipo VARCHAR(50),
    porque_no VARCHAR(255),
    frecuencia VARCHAR(20), 
    duracion SMALLINT,
    intensidad INT,
    tiempo_de_practica VARCHAR(20),
    pensamientos_con_realizar_AF VARCHAR(50),
    CONSTRAINT fk_eval_act_paciente FOREIGN KEY (historia_paciente_id) REFERENCES historias_pacientes_nutricion(id)
)

-- ===============================
-- EVALUACIÓN BIOQUÍMICA
-- ===============================
CREATE TABLE IF NOT EXISTS eval_bioq_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
    id_perfil_anemia INT,
    id_perfil_endocrino INT,
    id_perfil_renal_electrolitos INT,
    id_perfil_lipidos INT,
    id_balance_acido_base INT,
    id_perfil_orina INT,
    id_perfil_inflamatorio INT,
    id_eval_estado_nutr INT,
    CONSTRAINT fk_paciente_eval_bioq FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_anemia_eval_bioq FOREIGN KEY (id_perfil_anemia) REFERENCES perfil_anemia_nutricion(id),
    CONSTRAINT fk_endocrino_eval_bioq FOREIGN KEY (id_perfil_endocrino) REFERENCES perfil_endocrino(id),
    CONSTRAINT fk_renal_eval_bioq FOREIGN KEY (id_perfil_renal_electrolitos) REFERENCES perfil_renal_electrolitos(id),
    CONSTRAINT fk_lipidos_eval_bioq FOREIGN KEY (id_perfil_lipidos) REFERENCES perfil_lipidos(id),
    CONSTRAINT fk_acido_base_eval_bioq FOREIGN KEY (id_balance_acido_base) REFERENCES balance_acido_base(id),
    CONSTRAINT fk_orina_eval_bioq FOREIGN KEY (id_perfil_orina) REFERENCES perfil_orina(id),
    CONSTRAINT fk_inflamatorio_eval_bioq FOREIGN KEY (id_perfil_inflamatorio) REFERENCES perfil_inflamatorio(id),
    CONSTRAINT fk_estado_eval_bioq FOREIGN KEY (id_eval_estado_nutr) REFERENCES eval_estado_nutricion(id),
);

-- ===============================
-- EVALUACIÓN NUTRICIONAL
-- ===============================
CREATE TABLE IF NOT EXISTS eval_nutr_fh(
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    id_horarios_comida INT,
    id_eval_apetito INT,
    id_frec_consumo INT,
    CONSTRAINT fk_paciente_eval_nutr FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_horarios_eval_nutr FOREIGN KEY (id_horarios_comida) REFERENCES horarios_comida_nutricion(id),
    CONSTRAINT fk_apetito_eval_nutr FOREIGN KEY (id_eval_apetito) REFERENCES eval_apetito_nutricion(id),
    CONSTRAINT fk_frec_consumo_eval_nutr FOREIGN KEY (id_frec_consumo) REFERENCES frec_consumo_alimentos_nutricion(id)
);

CREATE TABLE IF NOT EXISTS patron_alimentacion_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BINARY(16) NOT NULL,
    fecha DATE,
    sigue_dieta BOOLEAN,
    tiene_alergia BOOLEAN,
    cual_alergia TEXT,
    alimentos_disgusta TEXT,
    CONSTRAINT fk_paciente_patron_alimentacion FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
);

-- ===============================
-- EXAMEN FISICO NUTRICION
-- ===============================
CREATE TABLE IF NOT EXISTS exam_fis_orien_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
    id_perdida_peso INT NOT NULL,
    id_signos_vitales INT NOT NULL,
    id_semiologia INT NOT NULL,
    CONSTRAINT fk_paciente_exam_fis FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_perdida_peso_exam_fis FOREIGN KEY (id_perdida_peso) REFERENCES eval_perdida_peso_nutricion(id),
    CONSTRAINT fk_signos_vitales_exam_fis FOREIGN KEY (id_signos_vitales) REFERENCES signos_vitales_nutricion(id),
    CONSTRAINT fk_semiologia_exam_fis FOREIGN KEY (id_semiologia) REFERENCES eval_semiologia_nutricional(id)
);

CREATE TABLE IF NOT EXISTS eval_sintomas_gastroin_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
    exam_fis_id INT NOT NULL, -- Aqui debe ser 1:N porque pueden ser varios sintomas
    presenta_sgi BOOLEAN,
    presencia VARCHAR(50),
    CONSTRAINT fk_exam_fis_sintomas FOREIGN KEY (exam_fis_id) REFERENCES exam_fis_orien_nutricion(id)
);

-- ===============================
-- EVALUACIÓN ANTROPOMÉTRICA
-- ===============================
CREATE TABLE IF NOT EXISTS eval_antro_ad_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
	paciente_id BINARY(16) NOT NULL,
	eval_antro_ad_kid_id INT
	eval_antro_ad_adulto_id INT,
	fecha DATE DEFAULT CURRENT_DATE,
	peso_actual FLOAT,
	estatura FLOAT,
	imc FLOAT,
	pantorrilla FLOAT,
	cintura FLOAT,
	pb FLOAT,
	pct FLOAT,
	pcse FLOAT,
    CONSTRAINT fk_paciente_eval_antro FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    CONSTRAINT fk_kid_eval_antro FOREIGN KEY (eval_antro_ad_kid_id) REFERENCES eval_antro_ad_kid_nutricion(id),
    CONSTRAINT fk_adulto_eval_antro FOREIGN KEY (eval_antro_ad_adulto_id) REFERENCES eval_antro_ad_adulto_nutricion(id)
);

-- ===============================
-- RECORDATORIO 24H
-- ===============================
CREATE TABLE IF NOT EXISTS rec_24h_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
	paciente_id BINARY(16) NOT NULL,
	fecha_eval DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_paciente_rec_24h FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS rec_24h_comidas(
	id INT AUTO_INCREMENT PRIMARY KEY,
	rec_24h_id INT NOT NULL,
	fecha DATE,
	comida VARCHAR(100),
	alimento VARCHAR(100),
	calorias FLOAT,
	grasa FLOAT,
	colesterol FLOAT,
	sodio FLOAT,
	carb FLOAT,
	proteinas FLOAT,
	azucar FLOAT,
	fibra FLOAT,
    CONSTRAINT fk_comidas_rec_24h FOREIGN KEY (rec_24h_id) REFERENCES rec_24h_nutricion(id)
);

-- ===============================
-- REPORTE EEN
-- ===============================
    --REVISAR LO QUE SE DEBE QUITAR POR LA NUEVA JUNTA
CREATE TABLE IF NOT EXISTS reporte_een_kids_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
	paciente_id BINARY(16) NOT NULL,
	eval_diag_edo_nutr TEXT,
	solicito_orient BOOLEAN,
	prescrip_nut_obs VARCHAR(100),
	educ_nut_obs VARCHAR(100),
	consejeria_nut_obs VARCHAR(100),
	coord_aten_nut_obs VARCHAR(100),
    CONSTRAINT fk_paciente_reporte_een_kid FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS reporte_een_adulto_nutricion(
    id INT AUTO_INCREMENT PRIMARY KEY,
	paciente_id BINARY(16) NOT NULL,
	habitos_ali_obs VARCHAR(100),
	alteraciones_gastroin VARCHAR(100),
    CONSTRAINT fk_paciente_reporte_een_adulto FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS diagnostico_nutricional_adulto(
    id INT AUTO_INCREMENT PRIMARY KEY,
	reporte_een_id INT NOT NULL,
	pes VARCHAR(255),
	intervencion VARCHAR(50),
	objetivos VARCHAR(255),
	indicadores VARCHAR(255),
	criterio VARCHAR(255),
	progreso VARCHAR(20),
    CONSTRAINT fk_reporte_diagnostico FOREIGN KEY (reporte_een_id) REFERENCES reporte_een_adulto_nutricion(id)
);

-- ===============================
-- TPAN
-- ===============================
CREATE TABLE IF NOT EXISTS tpan_nutricion(
	id INT AUTO_INCREMENT PRIMARY KEY,
	paciente_id BINARY(16) NOT NULL,
	fecha_eval DATE DEFAULT CURRENT_DATE,
	eval_realizada TEXT,
	observacion TEXT,
	estandares_com TEXT,
	decision TEXT,
	problema_iden TEXT,
	causa_probl TEXT,
	evidencia_probl TEXT,
	progreso TINYINT,
	CONSTRAINT fk_paciente_tpan FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- ===============================
-- REQ NUTRICIONAL EC Y CALCULO 
-- GET NUTRICIONAL
-- ===============================
CREATE TABLE IF NOT EXISTS cal_get_nutr(
	id INT AUTO_INCREMENT PRIMARY KEY,
	paciente_id BINARY(16) NOT NULL,
	fecha_eval DATE DEFAULT CURRENT_DATE,
	verdura TINYINT,
	fruta TINYINT,
	cereal_sin_grasa TINYINT,
	cereal_con_grasa TINYINT,
	leguminosas TINYINT,
	aoa_a TINYINT,
	aoa_b TINYINT,
	aoa_c TINYINT,
	aoa_d TINYINT,
	leche_a TINYINT,
	leche_b TINYINT,
	leche_c TINYINT,
	grasa_a TINYINT,
	grasa_b TINYINT,
	azucares TINYINT,
	rice_dream TINYINT,
	silk TINYINT,
	soyactive TINYINT,
	almond_breeze TINYINT,
	aube_baja TINYINT,
	nan_one TINYINT,
	aube_alta TINYINT,
	CONSTRAINT fk_paciente_cal_get FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- ===============================
-- LOGS (AUDITORÍA)
-- ===============================
CREATE TABLE IF NOT EXISTS registro_auditoria (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    usuario_id BINARY(16) NOT NULL,
    accion_id INT NOT NULL,
    entidad_id INT NOT NULL,
    objetivo_id BINARY(16) NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    CONSTRAINT fk_audit_accion FOREIGN KEY (accion_id) REFERENCES acciones(id),
    CONSTRAINT fk_audit_entidad FOREIGN KEY (entidad_id) REFERENCES entidades(id),
    CONSTRAINT fk_audit_objetivo FOREIGN KEY (objetivo_id) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS bitacora_emergencias (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    usuario_id BINARY(16) NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    ubicacion VARCHAR(255) NOT NULL,
    nombre VARCHAR(255),
    matricula VARCHAR(20),
    telefono VARCHAR(30),
    diagnostico VARCHAR(255),
    accion_realizada VARCHAR(255),
    tratamiento_admin VARCHAR(255),
    recurrente BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_bitacora_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ===============================
-- 2. INSERTAR VALORES BASE
-- ===============================
INSERT INTO
    estados (codigo)
VALUES
    ('ACTIVO'),
    ('PENDIENTE'),
    ('INACTIVO');

INSERT INTO
    roles (codigo)
VALUES
    ('PASANTE'),
    ('COORDINADOR'),
    ('SUPER_ADMIN');

INSERT INTO
    areas (nombre)
VALUES
    ('MEDICINA'),
    ('NUTRICION'),
    ('PSICOLOGIA'),
    ('PSIQUIATRIA');

INSERT INTO
    acciones (codigo)
VALUES
    ('CREAR'),
    ('EDITAR'),
    ('ELIMINAR'),
    ('INICIAR_SESION');

INSERT INTO
    entidades (nombre)
VALUES
    ('NOTA_MEDICA'),
    ('EXPEDIENTE_MEDICO'),
    ('PACIENTE'),
    ('USUARIO'),
    ('EMERGENCIA');

-- USUARIOS PRUEBA
INSERT INTO
    usuarios (
        id,
        nombre,
        fecha_nacimiento,
        correo,
        telefono,
        password_hash,
        estado_id,
        rol_id,
        area_id,
        foto,
        matricula,
        inicio_servicio,
        fin_servicio
    )
VALUES
    (
        UUID_TO_BIN(UUID()),
        'Dr. Carlos Herrera',
        '1980-04-12',
        'carlos.herrera@cais.com',
        '6861000001',
        '$123',
        1,
        3,
        1,
        'https://randomuser.me/api/portraits/men/45.jpg',
        'MED001',
        '08:00',
        '16:00'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Dra. Sofia Navarro',
        '1992-03-10',
        'sofia.navarro@uabc.edu.mx',
        '6861000002',
        '$123',
        1,
        2,
        1,
        'https://randomuser.me/api/portraits/women/44.jpg',
        'MED002',
        '09:00',
        '15:00'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Luis Mendoza',
        '1998-07-25',
        'luis.mendoza@uabc.edu.mx',
        '6861000003',
        '123',
        2,
        1,
        2,
        'https://randomuser.me/api/portraits/men/32.jpg',
        'NUT001',
        '10:00',
        '14:00'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Ana Torres',
        '1999-11-20',
        'ana.torres@uabc.edu.mx',
        '6861000004',
        '123',
        1,
        1,
        2,
        'https://randomuser.me/api/portraits/women/65.jpg',
        'NUT002',
        '07:00',
        '13:00'
    );