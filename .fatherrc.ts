import { defineConfig } from 'father';

export default defineConfig({
  define: {
    NPM_NAME: JSON.stringify(process.env.npm_package_name),
    NPM_VERSION: JSON.stringify(process.env.npm_package_version),
  },
  esm: {
    
  },
  umd: {
    output: {
      filename: "index.js",
    },
    extractCSS: false,
    externals: {
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "react",
        root: "React",
      },
    },
  },
});
