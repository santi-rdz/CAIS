/**
 * @file Builders de supertest agents autenticados.
 *
 * Cada función crea un usuario en la DB, hace login vía /auth/login, y
 * devuelve { agent, user } listos para usar en tests.
 *
 * El agent tiene la sesión activa (cookies persistidas entre requests).
 * El user contiene { id, idBuffer, correo, password, role, area, areaId }.
 */

import request from 'supertest'
import app from '#app'
import { createTestCoordinador, createTestPasante, createTestAdmin } from './db.js'

async function loginUser({ correo, password }) {
  const agent = request.agent(app)
  const res = await agent.post('/auth/login').send({ email: correo, password })
  if (res.status !== 200) {
    throw new Error(
      `Login falló para ${correo}: status=${res.status} body=${JSON.stringify(res.body)}`
    )
  }
  return agent
}

export async function authenticatedCoordinador({ area, tracker, overrides } = {}) {
  const user = await createTestCoordinador({ area, tracker, overrides })
  const agent = await loginUser({ correo: user.correo, password: user.password })
  return { agent, user }
}

export async function authenticatedPasante({ area, tracker, overrides } = {}) {
  const user = await createTestPasante({ area, tracker, overrides })
  const agent = await loginUser({ correo: user.correo, password: user.password })
  return { agent, user }
}

export async function authenticatedAdmin({ tracker, overrides } = {}) {
  const user = await createTestAdmin({ tracker, overrides })
  const agent = await loginUser({ correo: user.correo, password: user.password })
  return { agent, user }
}
