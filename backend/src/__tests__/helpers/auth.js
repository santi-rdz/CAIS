import request from 'supertest'
import app from '#app'
import { SEED_USERS } from './constants.js'

export async function loginAs(seedKey = 'admin') {
  const creds = SEED_USERS[seedKey]
  if (!creds) throw new Error(`Unknown seed user: ${seedKey}`)

  const agent = request.agent(app)
  const res = await agent.post('/auth/login').send(creds)
  if (res.status !== 200) {
    throw new Error(
      `Login as ${seedKey} (${creds.email}) failed with ${res.status}. ` +
        `Verifica seeds y credenciales.`
    )
  }
  return agent
}
