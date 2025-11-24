-- PERSON
CREATE TABLE IF NOT EXISTS person (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    name VARCHAR(255),
    birth_date DATE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30)
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

-- USER
CREATE TABLE IF NOT EXISTS user (
    person_id BINARY(16) NOT NULL,
    password_hash VARCHAR(255),
    status_id INT NOT NULL,
    role_id INT NOT NULL,
    area_id INT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT NULL,
    picture VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY (person_id),
    CONSTRAINT fk_user_person FOREIGN KEY (person_id) REFERENCES person(id),
    CONSTRAINT fk_user_status FOREIGN KEY (status_id) REFERENCES status(id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES role(id),
    CONSTRAINT fk_user_area FOREIGN KEY (area_id) REFERENCES area(id)
);

-- 2. Insertar valores base
INSERT INTO
    status (code)
VALUES
    ('ACTIVO'),
    ('PENDIENTE'),
    ('INACTIVO');

INSERT INTO
    role (code)
VALUES
    ('PASANTE'),
    ('COORDINADOR'),
    ('SUPER_ADMIN');

INSERT INTO
    area (name)
VALUES
    ('MEDICINA'),
    ('NUTRICION'),
    ('PSYCHOLOGY'),
    ('PSYCHIATRY');

-- PERSON
INSERT INTO
    person (id, name, birth_date, email, phone)
VALUES
    (
        UUID_TO_BIN(UUID()),
        'Raul Santiago Rodriguez',
        '1999-05-15',
        'raul.rodriguez@uabc.edu.mx',
        '555-0101'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Mariana Lopez Garcia',
        '2000-02-22',
        'mariana.lopez@uabc.edu.mx',
        '555-0102'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Carlos Fernandez',
        '1998-11-10',
        'carlos.fernandez@uabc.edu.mx',
        '555-0103'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Ana Paula Morales',
        '1997-07-05',
        'ana.morales@uabc.edu.mx',
        '555-0104'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Jorge Gutierrez',
        '2001-01-30',
        'jorge.gutierrez@uabc.edu.mx',
        '555-0105'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Sofia Navarro',
        '1999-12-12',
        'sofia.navarro@uabc.edu.mx',
        '555-0106'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Diego Castillo',
        '2000-09-09',
        'diego.castillo@uabc.edu.mx',
        '555-0107'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Valeria Jimenez',
        '2001-03-18',
        'valeria.jimenez@uabc.edu.mx',
        '555-0108'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Miguel Rios',
        '1998-06-21',
        'miguel.rios@uabc.edu.mx',
        '555-0109'
    ),
    (
        UUID_TO_BIN(UUID()),
        'Lucia Medina',
        '2000-08-25',
        'lucia.medina@uabc.edu.mx',
        '555-0110'
    );

-- USER
-- sql-formatter: off
INSERT INTO
    user (
        person_id,
        password_hash,
        status_id,
        role_id,
        area_id,
        created_at,
        last_login,
        picture
    )
VALUES
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'raul.rodriguez@uabc.edu.mx'
        ),
        '$2b$10$9GJVxNV1npVtZPqj4CEMCeZPZNfC7Ht9sWG0DEuDfSU/EYEYTbDre',
        1,
        1,
        1,
        NOW(),
        '2025-11-19 14:45:00',
        'https://randomuser.me/api/portraits/men/32.jpg'
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'mariana.lopez@uabc.edu.mx'
        ),
        'hash2',
        1,
        1,
        1,
        NOW(),
        '2024-05-02 09:20:00',
        'https://randomuser.me/api/portraits/women/44.jpg'
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'carlos.fernandez@uabc.edu.mx'
        ),
        'hash3',
        2,
        1,
        1,
        NOW(),
        NULL,
        ''
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'ana.morales@uabc.edu.mx'
        ),
        'hash4',
        3,
        1,
        1,
        NOW(),
        '2024-04-18 12:10:00',
        'https://randomuser.me/api/portraits/women/12.jpg'
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'jorge.gutierrez@uabc.edu.mx'
        ),
        'hash5',
        1,
        2,
        1,
        NOW(),
        '2024-02-27 07:55:00',
        'https://randomuser.me/api/portraits/men/83.jpg'
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'sofia.navarro@uabc.edu.mx'
        ),
        'hash6',
        1,
        1,
        1,
        NOW(),
        '2024-08-11 10:30:00',
        'https://randomuser.me/api/portraits/women/26.jpg'
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'diego.castillo@uabc.edu.mx'
        ),
        'hash7',
        3,
        2,
        1,
        NOW(),
        '2024-01-09 18:45:00',
        'https://randomuser.me/api/portraits/men/19.jpg'
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'valeria.jimenez@uabc.edu.mx'
        ),
        'hash8',
        1,
        1,
        1,
        NOW(),
        '2024-09-03 14:00:00',
        'https://randomuser.me/api/portraits/women/67.jpg'
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'miguel.rios@uabc.edu.mx'
        ),
        'hash9',
        2,
        1,
        1,
        NOW(),
        NULL,
        ''
    ),
    (
        (
            SELECT
                id
            FROM
                person
            WHERE
                email = 'lucia.medina@uabc.edu.mx'
        ),
        'hash10',
        3,
        1,
        1,
        NOW(),
        '2024-07-30 09:40:00',
        'https://randomuser.me/api/portraits/women/84.jpg'
    );

-- sql-formatter: on