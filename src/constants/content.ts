import { readFileSync } from "fs";
import * as vscode from "vscode";

export const getPackage = async (document: vscode.Uri) => {
  const activeWork = vscode.workspace.getWorkspaceFolder(document)?.uri.fsPath;
  (global as any).readFileSync = readFileSync;
  // const pathStr = `${activeWork}/package.json`?.replace(/\//g, "/");
  const pathStr = `${activeWork}/package.json`;
  const packageData = JSON.parse(await readFileSync(pathStr, "utf-8"));
  const pageageConfig = packageData?.config || {};
  return {
    xlsxDefaultLan: pageageConfig["wa-toolkit"]?.xlsxDefaultLan,
    xlsxTransformPath: pageageConfig["wa-toolkit"]?.xlsxTransformPath,
    xlsxTransformType: pageageConfig["wa-toolkit"]?.xlsxTransformType,
  };
};

export const baiduLangs = [
  { label: "中文", command: "zh" },
  { label: "英语", command: "en" },
  { label: "日语", command: "jp" },
  { label: "韩语	", command: "kor" },
  { label: "繁体中文", command: "cht" },
];
