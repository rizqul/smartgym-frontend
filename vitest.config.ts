import { defineConfig, mergeConfig } from "vitest/config"
import viteConfig from "./vite.config.ts"

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./test/setup.ts"],
      css: false,
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/**/*.{ts,tsx}"],
        exclude: [
          "test/**",
          "src/assets/**",
          "src/types/**",
          "src/**/*.test.{ts,tsx}",
          "src/**/*.d.ts",
          "src/main.tsx"
        ]
      }
    }
  })
)