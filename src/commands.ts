/**
 *@file 存放指令文件
 * */

// onStartup
// "when": "resourceFilename =~ /.*\\.xlsx$/",

import { functions } from "./functions";

export const commands = [
  { key: "extension.xlsxToTs", value: "xlsxToTs", func: functions.xlsxToTs },
  { key: "extension.createRfc", value: "createRfc", func: functions.createRfc },
  { key: "extension.createVue", value: "createVue", func: functions.createVue },
  {
    key: "extension.createClass",
    value: "createClass",
    func: functions.createClass,
  },
  { key: "extension.sideMenus", value: "sideMenus", func: functions.sideMenus },
];
