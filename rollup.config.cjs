const typescript = require("rollup-plugin-typescript2");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const pkg = require("./package.json");

module.exports = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main, // CommonJS
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module, // ESM
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
      // Exclude test files from the build
      tsconfigOverride: {
        exclude: [
          "src/hooks/tests/**",
          "**/*.test.ts",
          "**/*.test.tsx"
        ]
      }
    })
  ],
  external: ["react", "react-dom"],
};
