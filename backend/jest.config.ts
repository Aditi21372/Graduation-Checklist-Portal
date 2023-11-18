// jest.config.js
export default {
    preset: 'ts-jest/presets/default',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '<transform_regex>': ['ts-jest', { /* ts-jest config goes here in Jest */ }]
    },
    // Other configurations...
};
  