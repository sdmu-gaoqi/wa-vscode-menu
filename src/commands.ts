import { funcs } from "./func";

export const commands = [
  { key: "extension.xlsxToTs", value: "xlsxToTs", func: funcs.xlsxToTs },
  { key: "extension.createRfc", value: "createRfc", func: funcs.createRfc },
  { key: "extension.createVue", value: "createVue", func: funcs.createVue },
  {
    key: "extension.createClass",
    value: "createClass",
    func: funcs.createClass,
  },
];

// onStartup
// "when": "resourceFilename =~ /.*\\.xlsx$/",
