-- PERSON
CREATE TABLE IF NOT EXISTS pacientes (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255),
    birth_date DATE,
    es_externo BOOLEAN DEFAULT FALSE,
    email VARCHAR(255),
    phone VARCHAR(30),
    genero VARCHAR(20),
    domicilio VARCHAR (255),
    ocupacion VARCHAR (100),
    estado_civil VARCHAR (50),
    nivel_educativo VARCHAR (100),
    religion VARCHAR (100),
    nss VARCHAR (50),
    contacto_emergencia VARCHAR (255),
    telefono_emergencia VARCHAR (30),
    parentesco_emergencia VARCHAR (100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

--ACTUALIZACIÓN NUTRICIÓN

CREATE TABLE IF NOT EXISTS historia_medica_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    enfermedad VARCHAR(100),
    eval INT,
    farmacos VARCHAR(255),
    dosis VARCHAR(20)
)

CREATE TABLE IF NOT EXISTS tratamiento_alt_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    producto VARCHAR(255),
    cual_producto VARCHAR(255),
    mejora VARCHAR(10),
    dosis VARCHAR(20)
)

CREATE TABLE IF NOT EXISTS adicciones_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    adicciones SMALLINT, --1210 Para decir que si fuma, esta inactivo en alcohol, usa drogas y no tiene medicinas
    tabaco_frecuencia VARCHAR(20),
    num_cigarros_d TINYINT,
    alcohol_frecuencia VARCHAR(20),
    ml_ocasion SMALLINT,
    drogas_frecuencia VARCHAR(20),
    cual_droga VARCHAR(255),
    med_contr_frecuencia VARCHAR(20),
    cual_med_contr VARCHAR(255)
)

CREATE TABLE IF NOT EXISTS eval_cal_sueno_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(), --AQUI TENGO DUDA CON EL VALOR
    horas_sueno TINYINT,
    insomnio TINYINT,
    medicacion TINYINT
)

CREATE TABLE IF NOT EXISTS eval_act_fisica_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
    tipo VARCHAR(50),
    porque_no VARCHAR(255),
    frecuencia VARCHAR(20), -- tiene dias por semana o una vez al mes, por lo que esta raro
    duracion SMALLINT,
    intensidad VARCHAR(20), -- DUDA PORQUE TIENE UN PORCENTAJE
    tiempo_de_practica VARCHAR(20),
    pensamientos_con_realizar_AF VARCHAR(50)
)

    --Eval.Bioq.BD
CREATE TABLE IF NOT EXISTS eval_bioq_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
    --PERFIL INFLAMATORIO
    pcr FLOAT,
    plaquetas INT
)

CREATE TABLE IF NOT EXISTS perfil_anemia_nutricia(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    id_eval_bioq BINARY(16) NOT NULL,
    eritrocitos FLOAT, -- ?
    hemoglobina FLOAT, -- ?
    hematocrito FLOAT,
    vcm FLOAT,
    homocisteina FLOAT,
    ferritina FLOAT,
    hierro FLOAT,
    cap_fij_tot_he FLOAT,
    saturacion_hierro FLOAT
)

CREATE TABLE IF NOT EXISTS perfil_endocrino(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    id_eval_bioq BINARY(16) NOT NULL,
    glucosa FLOAT,
    hbAlc FLOAT,
    insulina FLOAT,
    tiroxina_libre FLOAT,
    triyodotironina FLOAT
)

CREATE TABLE IF NOT EXISTS perfil_renal_electrolitos(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    id_eval_bioq BINARY(16) NOT NULL,
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
)

CREATE TABLE IF NOT EXISTS perfil_lipidos(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    id_eval_bioq BINARY(16) NOT NULL,
    colesterol FLOAT,
    c_hdl FLOAT,
    c_ldl FLOAT,
    trigliceridos FLOAT
)

CREATE TABLE IF NOT EXISTS balance_acido_base(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    id_eval_bioq BINARY(16) NOT NULL,
    ph_serico FLOAT,
    saturacion_o2 FLOAT,
    bicarbonato FLOAT,
    pco2_total FLOAT
)

CREATE TABLE IF NOT EXISTS perfil_orina_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    id_eval_bioq BINARY(16) NOT NULL,
    volumen_urinario SMALLINT,
    densidad FLOAT,
    alteraciones_urinarias VARCHAR(50),
    litos VARCHAR(50),
    ph FLOAT,
    cetonas VARCHAR(50),
    sodio SMALLINT
)

CREATE TABLE IF NOT EXISTS eval_estado_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    id_eval_bioq BINARY(16) NOT NULL,
    leucocitos FLOAT,
    linfocitos FLOAT,
    ctl FLOAT, --calculo
    albumina FLOAT,
    pre_albumina FLOAT,
    transferrina FLOAT
)
    --fin Eval.Bioq.BD
    --Eval.nutr.FH
CREATE TABLE IF NOT EXISTS horarios_comida_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
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
)

CREATE TABLE IF NOT EXISTS eval_apetito_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT(UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
    apetito VARCHAR(20),
    lleno VARCHAR(20),
    sabor_comida VARCHAR(20),
    comidas_al_día VARCHAR(20),
    puntaje_total TINYINT,
    clasif_alteración_apetito VARCHAR(20)
)

CREATE TABLE IF NOT EXISTS frec_consumo_alimentos_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
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
)

    --fin Eval.nutr.FH
    --Exam.Fis.Orien.Nut
CREATE TABLE IF NOT EXISTS eval_perdida_peso_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
    peso_habitual FLOAT,
    peso_perdido FLOAT,
    porcentaje_peso_perdido FLOAT, --calculo
)

CREATE TABLE IF NOT EXISTS eval_sintomas_gastroin_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
    presenta_sgi BOOLEAN,
    presencia VARCHAR(50)
)

CREATE TABLE IF NOT EXISTS signos_vitales_nutricion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BINARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
    tas	FLOAT,
    tad	FLOAT,
    temperatura	FLOAT,
    dificultad_respiratoria	BOOLEAN
)

CREATE TABLE IF NOT EXISTS eval_semiologia_nutricional(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    paciente_id BIARY(16) NOT NULL,
    fecha DATE DEFAULT CURRENT_TIMESTAMP(),
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
    descripcion TEXT,
    descripcion_sist_genito_urinario TEXT	
)

    --fin Exam.Fis.Orien.Nut
    --Eval.antro.AD
CREATE TABLE IF NOT EXISTS eval_antro_ad_nutricion(
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	paciente_id BINARY(16) NOT NULL,
	eval_antro_ad_kid_id BINARY(16),
	eval_antro_ad_adulto_id BINARY(16),
	fecha DATE DEFAULT CURRENT_TIMESTAMP(),
	peso_actual FLOAT,
	estatura FLOAT,
	imc FLOAT,
	pantorrilla FLOAT,
	cintura FLOAT,
	pb FLOAT,
	pct FLOAT,
	pcse FLOAT
)

CREATE TABLE IF NOT EXISTS eval_antro_ad_kid_nutricion(
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	percentiles_imc FLOAT,
	interpretacion_imc VARCHAR(255), --DUDA
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
	diagnostico_general VARCHAR(50)
)

		-- FALTA REVISAR LO DE ANALISIS VECTORIAL

CREATE TABLE IF NOT EXISTS eval_antro_ad_adulto_nutricion(
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
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
)
    --fin Eval.antro.AD
    --Rec24h
CREATE TABLE IF NOT EXISTS rec_24h_nutricion(
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	paciente_id BINARY(16) NOT NULL,
	fecha_eval DATE DEFAULT CURRENT_TIMESTAMP(),
	-- PREGUNTAR SI PASAR LO DE ARRIBA A UNA TABLA
	-- Y LO DE ABAJO A OTRA QUE REFERENCIE LA DE ARRIBA
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
	fibra FLOAT
)
    --fin Rec24h
    --Reporte EEN
CREATE TABLE IF NOT EXISTS reporte_een_kids_nutricion(
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	paciente_id BINARY(16) NOT NULL,
	eval_diag_edo_nutr TEXT,
	solicito_orient BOOLEAN,
	prescrip_nut_obs VARCHAR(100),
	educ_nut_obs VARCHAR(100),
	consejeria_nut_obs VARCHAR(100),
	coord_aten_nut_obs VARCHAR(100)
)

CREATE TABLE IF NOT EXISTS reporte_een_adulto_nutricion(
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	paciente_id BINARY(16) NOT NULL,
	habitos_ali_obs VARCHAR(100),
	alteraciones_gastroin VARCHAR(100)
)

CREATE TABLE IF NOT EXISTS diagnostico_nutricional_adulto(
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	paciente_id BINARY(16) NOT NULL,
	pes VARCHAR(255),
	intervencion VARCHAR(50),
	objetivos VARCHAR(255),
	indicadores VARCHAR(255),
	criterio VARCHAR(255),
	progreso VARCHAR(20)
	--DUDA CON LOS VARCHAR
)
    --fin Reporte EEN

--FIN ACTUALIZACIÓN NUTRICIÓN

CREATE TABLE IF NOT EXISTS historia_medicina(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),    
    paciente_id BINARY(16) NOT NULL,
    antecedentes_familiares_id INT,
    antecedentes_patologicos_id INT,
    servicios_id INT,
    inmunizaciones_id INT,
    info_fisica_id INT,
    tipo_sangre VARCHAR(5),
    vacunas_infancia_completas BOOLEAN,
    motivo_consulta TEXT,
    historia_enfermedad_actual TEXT,
    aparatos_sistemas_id INT,
    plan_estudio_id INT,
    CONSTRAINT fk_historia_paciente
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    CONSTRAINT fk_historia_antecedentes_familiares
        FOREIGN KEY (antecedentes_familiares_id) REFERENCES antecedentes_familiares(id)
    CONSTRAINT fk_historia_servicios
        FOREIGN KEY (servicios_id) REFERENCES servicios(id)
    CONSTRAINT fk_historia_inmunizaciones
        FOREIGN KEY (inmunizaciones_id) REFERENCES inmunizaciones(id)
    CONSTRAINT fk_historia_info_fisica
        FOREIGN KEY (info_fisica_id) REFERENCES info_fisica(id)
    CONSTRAINT fk_historia_antecedentes_patologicos
        FOREIGN KEY (antecedentes_patologicos_id) REFERENCES antecedentes_patologicos(id)
    CONSTRAINT fk_historia_aparatos_sistemas
        FOREIGN KEY (aparatos_sistemas_id) REFERENCES aparatos_sistemas(id)
    CONSTRAINT fk_historia_plan_estudio
        FOREIGN KEY (plan_estudio_id) REFERENCES plan_estudio(id)
)

CREATE TABLE IF NOT EXISTS nota_evolucion(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    historia_medica_id BINARY(16),
    paciente_id BINARY(16),
    motivo_consulta TEXT,
    ant_gine_andro TEXT,
    aparatos_sistemas_id INT,
    info_fisica INT,
    plan_estudio INT,
    CONSTRAINT fk_nota_pacientes
        FOREIGN KEY (paciente_id) pacientes(id)
    CONSTRAINT fk_nota_aparatos_sistemas
        FOREIGN KEY (aparatos_sistemas) REFERENCES aparatos_sistemas(id)
    CONSTRAINT fk_historia_info_fisica
        FOREIGN KEY (info_fisica_id) REFERENCES info_fisica(id)
    CONSTRAINT fk_historia_plan_estudio
        FOREIGN KEY (plan_estudio_id) REFERENCES plan_estudio(id)
    CONSTRAINT fk_nota_historia
        FOREIGN KEY (historia_medica_id) REFERENCES historia_medica(id)
)

CREATE TABLE IF NOT EXISTS antecedentes_familiares(
    id INT AUTO_INCREMENT PRIMARY KEY,
    padre VARCHAR(255),
    madre VARCHAR(255),
    abuelo_paterno VARCHAR(255),
    abuelo_materno VARCHAR(255),
    abuela_paterna VARCHAR(255),
    abuela_materna VARCHAR(255),
    otros VARCHAR(255),
)

CREATE TABLE IF NOT EXISTS antecedentes_patologicos(
    id INT AUTO_INCREMENT PRIMARY KEY,
    cronico_degenerativos TEXT,
    quirurgicos TEXT,
    hospitalizaciones TEXT,
    traumaticos TEXT,
    tranfunsionales TEXT,
    transplantes TEXT,
    alergicos TEXT,
    infectocontagiosos TEXT,
    toxicomanias TEXT,
    covid_19 TEXT,
    psicologia_psiquiatria TEXT,
    gyo TEXT,
    enfermedades_congenitas TEXT,
    enfermedadaes_infancia TEXT,
)
CREATE TABLE IF NOT EXISTS aparatos_sistemas(
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
    nutricional TEXT,
)

CREATE TABLE IF NOT EXISTS servicios(
    id INT AUTO_INCREMENT PRIMARY KEY,
    gas BOOLEAN,
    luz BOOLEAN,
    agua BOOLEAN,
    drenaje BOOLEAN,
    cable_tel BOOLEAN,
    internet BOOLEAN
)
CREATE TABLE IF NOT EXISTS inmunizaciones(
    id INT AUTO_INCREMENT PRIMARY KEY,
    influenza TIMESTAMP DEFAULT NULL,
    tetanos TIMESTAMP DEFAULT NULL,
    hepatitis_b TIMESTAMP DEFAULT NULL,
    covid_19 TIMESTAMP DEFAULT NULL,
    otros TEXT DEFAULT NULL
)

CREATE TABLE IF NOT EXISTS info_fisica(
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
    habito_exterior TEXT,
)
CREATE TABLE IF NOT EXISTS plan_estudio(
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_cie10 VARCHAR(50) NOT NULL,
    plan_tratamiento TEXT,
    usuario_id BINARY(16) NOT NULL,
    generado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    tratamiento TEXT,
    CONSTRAINT fk_plan_user 
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
)

-- USER (with ON DELETE CASCADE)
CREATE TABLE IF NOT EXISTS usuarios (
    id BINARY(16) NOT NULL,
    name VARCHAR(255),
    birth_date DATE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30),
    password_hash VARCHAR(255),
    status_id INT NOT NULL,
    role_id INT NOT NULL,
    area_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL,
    picture VARCHAR(255) DEFAULT NULL,
    matricula VARCHAR(20) DEFAULT NULL,
    service_start VARCHAR(8) DEFAULT NULL,
    service_end VARCHAR(8) DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_status 
        FOREIGN KEY (status_id) REFERENCES status(id),

    CONSTRAINT fk_user_role 
        FOREIGN KEY (role_id) REFERENCES role(id),

    CONSTRAINT fk_user_area 
        FOREIGN KEY (area_id) REFERENCES area(id)
);

CREATE TABLE audit_log(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    action_id INT NOT NULL,
    entity_id INT NOT NULL,
    target_id BINARY DEFAULT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user 
        FOREIGN KEY (user_id) REFERENCES user(id)
    CONSTRAINT fk_audit_action 
        FOREIGN KEY (action_id) REFERENCES action(id),
    CONSTRAINT fk_audit_entity 
        FOREIGN KEY (entity_id) REFERENCES entity(id)
    CONSTRAINT fk_audit_target 
        FOREIGN KEY (target_id) REFERENCES pacientes(id)
)

CREATE TABLE IF NOT EXISTS bitacora_emergencia(
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ubicacion VARCHAR(255) NOT NULL,
    nombre VARCHAR(255),
    matricula VARCHAR(20),
    telefono VARCHAR(30),
    diagnostico VARCHAR(255),
    accion_realizada VARCHAR(255),
    tratamiento_admin VARCHAR(255),
    recurrente BOOLEAN DEFAULT FALSE,
    constraint fk_bitacora_user
        FOREIGN KEY (user_id) REFERENCES usuarios(id)
)

CREATE TABLE IF NOT EXISTS action(
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS entity(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
)

-- TOKENS (with ON DELETE CASCADE)
CREATE TABLE pre_register_token (
    person_id BINARY(16) NOT NULL,
    token CHAR(36) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    PRIMARY KEY(token),
    CONSTRAINT fk_token_person 
        FOREIGN KEY(person_id) REFERENCES person(id)
        ON DELETE CASCADE
);

-- status
CREATE TABLE IF NOT EXISTS status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE
);

-- ROLE
CREATE TABLE IF NOT EXISTS role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE
);

-- AREA
CREATE TABLE IF NOT EXISTS area (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Insertar valores base
INSERT INTO status (code) VALUES
('ACTIVO'), ('PENDIENTE'), ('INACTIVO');

INSERT INTO role (code) VALUES
('PASANTE'), ('COORDINADOR'), ('SUPER_ADMIN');

INSERT INTO area (name) VALUES
('MEDICINA'), ('NUTRICION'), ('PSYCHOLOGY'), ('PSYCHIATRY');

INSERT INTO action (code) VALUES
('CREAR'), ('EDITAR'), ('ELIMINAR'), ('INICIAR_SESION');

INSERT INTO entity (name) VALUES
('NOTA_MEDICA'), ('EXPEDIENTE_MEDICO'), ('PACIENTE'), ('USUARIO'), ('EMERGENCIA');

-- PERSON
INSERT INTO person (id, name, birth_date, email, phone) VALUES
(UUID_TO_BIN(UUID()), 'Raul Santiago Rodriguez', '1999-05-15', 'raul.rodriguez@uabc.edu.mx', '555-0101'),
(UUID_TO_BIN(UUID()), 'Mariana Lopez Garcia', '2000-02-22', 'mariana.lopez@uabc.edu.mx', '555-0102'),
(UUID_TO_BIN(UUID()), 'Carlos Fernandez', '1998-11-10', 'carlos.fernandez@uabc.edu.mx', '555-0103'),
(UUID_TO_BIN(UUID()), 'Ana Paula Morales', '1997-07-05', 'ana.morales@uabc.edu.mx', '555-0104'),
(UUID_TO_BIN(UUID()), 'Jorge Gutierrez', '2001-01-30', 'jorge.gutierrez@uabc.edu.mx', '555-0105'),
(UUID_TO_BIN(UUID()), 'Sofia Navarro', '1999-12-12', 'sofia.navarro@uabc.edu.mx', '555-0106'),
(UUID_TO_BIN(UUID()), 'Diego Castillo', '2000-09-09', 'diego.castillo@uabc.edu.mx', '555-0107'),
(UUID_TO_BIN(UUID()), 'Valeria Jimenez', '2001-03-18', 'valeria.jimenez@uabc.edu.mx', '555-0108'),
(UUID_TO_BIN(UUID()), 'Miguel Rios', '1998-06-21', 'miguel.rios@uabc.edu.mx', '555-0109'),
(UUID_TO_BIN(UUID()), 'Lucia Medina', '2000-08-25', 'lucia.medina@uabc.edu.mx', '555-0110');

-- USER
INSERT INTO user (
    person_id, password_hash, status_id, role_id, area_id, created_at, last_login, picture
)
VALUES
((SELECT id FROM person WHERE email = 'raul.rodriguez@uabc.edu.mx'),
 '$2b$10$9GJVxNV1npVtZPqj4CEMCeZPZNfC7Ht9sWG0DEuDfSU/EYEYTbDre', 1, 1, 1, NOW(), 
 '2025-11-19 14:45:00', 'https://randomuser.me/api/portraits/men/32.jpg'),

((SELECT id FROM person WHERE email = 'mariana.lopez@uabc.edu.mx'),
 'hash2', 1, 1, 1, NOW(), '2024-05-02 09:20:00',
 'https://randomuser.me/api/portraits/women/44.jpg'),

((SELECT id FROM person WHERE email = 'carlos.fernandez@uabc.edu.mx'),
 'hash3', 2, 1, 1, NOW(), NULL, ''),

((SELECT id FROM person WHERE email = 'ana.morales@uabc.edu.mx'),
 'hash4', 3, 1, 1, NOW(), '2024-04-18 12:10:00',
 'https://randomuser.me/api/portraits/women/12.jpg'),

((SELECT id FROM person WHERE email = 'jorge.gutierrez@uabc.edu.mx'),
 'hash5', 1, 2, 1, NOW(), '2024-02-27 07:55:00',
 'https://randomuser.me/api/portraits/men/83.jpg'),

((SELECT id FROM person WHERE email = 'sofia.navarro@uabc.edu.mx'),
 'hash6', 1, 1, 1, NOW(), '2024-08-11 10:30:00',
 'https://randomuser.me/api/portraits/women/26.jpg'),

((SELECT id FROM person WHERE email = 'diego.castillo@uabc.edu.mx'),
 'hash7', 3, 2, 1, NOW(), '2024-01-09 18:45:00',
 'https://randomuser.me/api/portraits/men/19.jpg'),

((SELECT id FROM person WHERE email = 'valeria.jimenez@uabc.edu.mx'),
 'hash8', 1, 1, 1, NOW(), '2024-09-03 14:00:00',
 'https://randomuser.me/api/portraits/women/67.jpg'),

((SELECT id FROM person WHERE email = 'miguel.rios@uabc.edu.mx'),
 'hash9', 2, 1, 1, NOW(), NULL, ''),

((SELECT id FROM person WHERE email = 'lucia.medina@uabc.edu.mx'),
 'hash10', 3, 1, 1, NOW(), '2024-07-30 09:40:00',
 'https://randomuser.me/api/portraits/women/84.jpg');


