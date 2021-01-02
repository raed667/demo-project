#!/usr/bin/env node

const path = require("path");
const rimraf = require("rimraf");
const codegen = require("openapi-typescript-codegen");

const inputFile = path.join(__dirname, "../../backend/dist/swagger.json");
const outputDir = path.join(__dirname, "../../frontend/src/rest-client");

rimraf.sync(outputDir);

codegen.generate({
  input: inputFile,
  output: outputDir,
  useOptions: true,
  httpClient: codegen.HttpClient.XHR,
});
