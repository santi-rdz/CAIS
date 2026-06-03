export default {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  globalTeardown: '<rootDir>/jest.teardown.js',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  // Tests son aislados (cada uno crea sus propias fixtures con uniqueEmail
  // + cleanup tracker). 50% de cores en local; CI runner con 4 vCPUs → 2.
  maxWorkers: '50%',
  testTimeout: 10000,
  moduleNameMapper: {
    '^#app$': '<rootDir>/src/app.js',
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#lib/(.*)$': '<rootDir>/src/lib/$1',
    '^#models/(.*)$': '<rootDir>/src/models/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
    '^@cais/shared/(.*)$': '<rootDir>/../shared/$1',
  },
}
