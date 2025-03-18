import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, cg) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173/"
  },
});
