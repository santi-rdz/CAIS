export class TokenModel {
  static async insertTokens(users, conn) {
    for (const u of users) {
      await conn.query(
        `INSERT INTO pre_register_token (person_id, token, expires_at)
       VALUES (UUID_TO_BIN(?), ?, ?)`,
        [u.personId, u.token, u.expiresAt]
      )
    }
  }
}
