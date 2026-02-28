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
    creado_at DATETIME DEFAULT CURRENT_TIMESTAMP
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