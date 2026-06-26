export default {
  testEnvironment: 'node',
  globalTeardown: '<rootDir>/jest.teardown.js',
  testMatch: ['<rootDir>/src/**/*.test.js'],
  // Tests son aislados (cada uno crea sus propias fixtures con uniqueEmail
  // + cleanup tracker). En CI (ubuntu-latest tiene 2 vCPUs) forzamos 2
  // workers porque '50%' se redondearía a 1 = serial. Local usa 50% de
  // cores (4-5 en M-series) con margen para no saturar MySQL.
  maxWorkers: process.env.CI ? 2 : '50%',
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
