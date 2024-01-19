import * as vscode from "vscode";
import { getPackage } from "./constants/content";

export const defaultXlsxPath = "src/locales/lang.xlsx";
export const defaultXlsxTransformPath = "src/locales";
export const defaultXlsxTransformLanauges = [
  "zh-CN",
  "zh-TW",
  "en-US",
  "ja-JP",
  "ko-KR",
];
export const defaultLang = "zh-CN";

/**
 * @description 获取vscode 插件配置 没有就用默认的
 * */
export const getInitConstants = async (document: vscode.Uri) => {
  const packageConfig = await getPackage(document);
  const _xlsxTransformPath =
    packageConfig?.xlsxTransformPath ||
    vscode.workspace.getConfiguration().get("xlsxTransformPath") ||
    defaultXlsxTransformPath;
  const _xlsxTransformType =
    packageConfig?.xlsxTransformType ||
    vscode.workspace.getConfiguration().get("xlsxTransformType") ||
    defaultXlsxTransformLanauges;
  const _xlsxDefaultLang =
    packageConfig?.xlsxDefaultLan ||
    vscode.workspace.getConfiguration().get("xlsxDefaultLan") ||
    defaultLang;

  return {
    xlsxTransformPath: _xlsxTransformPath as string,
    xlsxTransformType: _xlsxTransformType as string,
    defaultLang: _xlsxDefaultLang,
  };
};
