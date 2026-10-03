import nextJest from "next/jest.js";

// next/jest compiles TypeScript with the Next.js (SWC) compiler, so no Babel or ts-node is needed.
const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  // The tests cover pure domain logic (no DOM), so the plain Node environment is enough.
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
