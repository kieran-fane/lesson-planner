import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  // 1. Core “eslint:recommended” rules
  js.configs.recommended,

  // 2. React’s flat‑config “recommended” rules
  react.configs.flat.recommended,    // JSX‑specific
  react.configs.flat["jsx-runtime"], // React 17+ runtime

  // 3. React version detection for plugin rules
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
