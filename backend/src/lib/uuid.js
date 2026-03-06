/**
 * Convert a UUID string to a Buffer (BINARY(16) compatible).
 * @param {string} uuid - e.g. "550e8400-e29b-41d4-a716-446655440000"
 * @returns {Buffer}
 */
export const uuidToBuffer = (uuid) => Buffer.from(uuid.replace(/-/g, ''), 'hex')

/**
 * Convert a Buffer (BINARY(16)) back to a UUID string.
 * @param {Buffer} buf
 * @returns {string} - e.g. "550e8400-e29b-41d4-a716-446655440000"
 */
export const bufferToUUID = (buf) => {
  const hex = Buffer.from(buf).toString('hex')
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-')
}
