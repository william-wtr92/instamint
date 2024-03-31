import type { Config } from "jest"

const config: Config = {
  transform: {
    "^.+\\.(ts|tsx)$": "esbuild-jest",
  },
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testTimeout: 30000,
}

export default config
