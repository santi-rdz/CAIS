import request from 'supertest';
import server from './server.js';

describe('API de Pacientes', () => {
  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  describe('POST /api/patients', () => {
    it('debe crear un nuevo paciente con todos los datos', async () => {
      const newPatient = {
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-05-15',
        telefono: '1234567890',
        email: 'juan.perez@example.com',
        direccion: 'Calle Principal 123'
      };

      const response = await request(server)
        .post('/api/patients')
        .send(newPatient)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        nombre: 'Juan',
        apellido: 'Pérez',
        fechaNacimiento: '1990-05-15',
        telefono: '1234567890',
        email: 'juan.perez@example.com',
        direccion: 'Calle Principal 123',
        fechaRegistro: expect.any(String)
      });
    });

    it('debe crear un paciente con solo datos requeridos', async () => {
      const newPatient = {
        nombre: 'María',
        apellido: 'González',
        fechaNacimiento: '1985-08-20'
      };

      const response = await request(server)
        .post('/api/patients')
        .send(newPatient)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        nombre: 'María',
        apellido: 'González',
        fechaNacimiento: '1985-08-20',
        telefono: '',
        email: '',
        direccion: ''
      });
    });

    it('debe retornar error 400 si falta el nombre', async () => {
      const invalidPatient = {
        apellido: 'López',
        fechaNacimiento: '1995-03-10'
      };

      const response = await request(server)
        .post('/api/patients')
        .send(invalidPatient)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('debe retornar error 400 si falta el apellido', async () => {
      const invalidPatient = {
        nombre: 'Carlos',
        fechaNacimiento: '1988-11-25'
      };

      const response = await request(server)
        .post('/api/patients')
        .send(invalidPatient)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('debe retornar error 400 si falta la fecha de nacimiento', async () => {
      const invalidPatient = {
        nombre: 'Ana',
        apellido: 'Martínez'
      };

      const response = await request(server)
        .post('/api/patients')
        .send(invalidPatient)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/patients', () => {
    it('debe retornar todos los pacientes', async () => {
      const response = await request(server)
        .get('/api/patients')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
