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


