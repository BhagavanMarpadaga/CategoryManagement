// /** @type {import('ts-jest').JestConfigWithTsJest} */
// export const preset = "ts-jest";
// export const testEnvironment = "node";
// export const roots = ["<rootDir>/tests"];
// export const transform = {
//     "^.+\\.ts$": "ts-jest", // Transform TypeScript files using ts-jest
// };
// export const moduleFileExtensions = ["ts", "js", "json"];
// export const testMatch = [
//     "**/__tests__/**/*.test.ts", // Match test files in __tests__ folder
//     "**/?(*.)+(spec|test).ts", // Match *.test.ts or *.spec.ts files
// ];
// export const globalSetup = "./tests/setup/globalSetup.ts";
// export const globalTeardown = "./tests/setup/globalTeardown.ts";
// export const setupFilesAfterEnv = ["./tests/setup/setupTest.ts"];
// export const verbose = true;
// export const collectCoverage = true;
// export const collectCoverageFrom = ["src/**/*.ts"];
// export const coverageDirectory = "coverage";

import type {Config} from 'jest';

const config: Config = {
  verbose: true,
};

export default config;