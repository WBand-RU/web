import { defineConfig, OptionsExport } from "orval";

function getConfig(
  baseUrl: string,
  inputTarget: string,
  serviceName: string,
): OptionsExport {
  return {
    input: {
      target: `${baseUrl}${inputTarget}`,
    },
    output: {
      target: `src/lib/generated/${serviceName}/api-client.ts`,
      schemas: `src/lib/generated/${serviceName}/model`,
      client: "fetch",
      mode: "split",
      baseUrl,
      clean: true,
      formatter: "prettier",
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
  };
}

export default defineConfig({
  bandsService: getConfig(
    "https://bands-api.staging.wband.ru",
    "/openapi.json",
    "bands-service.ts",
  ),
});
