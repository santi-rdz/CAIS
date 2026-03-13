export default {
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^#app$': '<rootDir>/src/app.js',
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#lib/(.*)$': '<rootDir>/src/lib/$1',
    '^#models/(.*)$': '<rootDir>/src/models/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
  },
}
