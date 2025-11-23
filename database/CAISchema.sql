-- PERSON
CREATE TABLE person (
    person_id      INT PRIMARY KEY,
    given_name     VARCHAR(255)  NOT NULL,
    family_name    VARCHAR(255)  NOT NULL,
    birth_date     DATE          NOT NULL,
    email          VARCHAR(255)  NOT NULL UNIQUE,
    phone          VARCHAR(30)
);


-- STATUS
CREATE TABLE user_status (
    status_id   INT PRIMARY KEY,
    code        VARCHAR(50)  NOT NULL UNIQUE   -- ACTIVE, SUSPENDED or DISABLED
);


-- ROLE
CREATE TABLE user_role (
    role_id     INT PRIMARY KEY,
    code        VARCHAR(50)  NOT NULL UNIQUE   -- DOCTOR, COORDINATOR or SUPER_ADMIN
);


-- AREA
CREATE TABLE area (
    area_id     INT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE -- MEDICINE, NUTRITION, PSYCHOLOGY or PSYCHIATRY
);

-- USER
CREATE TABLE user_account (
    user_id        INT PRIMARY KEY,
    person_id      INT NOT NULL,
    username       VARCHAR(50) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    status_id      INT NOT NULL,
    role_id        INT NOT NULL,
    area_id        INT NULL, -- NULL for SUPER_ADMIN

    CONSTRAINT fk_user_person FOREIGN KEY (person_id) REFERENCES person(person_id),
    CONSTRAINT fk_user_status FOREIGN KEY (status_id) REFERENCES user_status(status_id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES user_role(role_id),
    CONSTRAINT fk_user_area FOREIGN KEY (area_id) REFERENCES area(area_id)
);
