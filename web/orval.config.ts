import { defineConfig } from "orval"

export default defineConfig({
  bandsService: {
    input: {
      target: "https://bands-api.staging.wband.ru/openapi.json",
    },
    output: {
      target: "src/lib/api/generated/bands-service.ts",
      schemas: "src/lib/api/generated/model",
      client: "fetch",
      mode: "split",
      baseUrl: "https://bands-api.staging.wband.ru",
      clean: true,
      prettier: false,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: "./src/lib/api/custom-fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
})
