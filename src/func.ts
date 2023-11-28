import path = require("path");
import * as vscode from "vscode";
import * as xlsx from "xlsx";
import * as fs from "fs";
import * as prettier from "prettier";
import { getInitConstants } from "./initConstants";
import {
  classContent,
  jsxContent,
  tsxContent,
  vueTemplateContent,
  vueTsxContent,
} from "./constants/content";

export const funcs = {
  // xlsx转ts
  xlsxToTs: async (document: vscode.Uri) => {
    try {
      //   const pathFile = await vscode.workspace.openTextDocument(document.fsPath);
      (global as any).xlsx = xlsx;
      (global as any).pathFile = document;
      const { xlsxTransformPath, xlsxTransformType } = getInitConstants();
      const data = fs.readFileSync(document.fsPath).buffer;
      const file = xlsx.read(data);
      const l10n: Record<string, Record<string, string>> = {};
      for (const sheetName of file.SheetNames) {
        const sheetData: any = xlsx.utils.sheet_to_json(file.Sheets[sheetName]);
        const fields = Object.keys(sheetData[0]);

        // 获取到xlsx里的数据转成Object格式
        sheetData.forEach((word: Record<string, string>) => {
          // 0 是 key
          for (let index = 1; index < fields.length; index++) {
            const field = fields[index];
            if (!l10n[field]) {
              l10n[field] = {};
            }
            l10n[field][word.key] = String(word[field || "zh-CN"]) || "";
          }
        });
        const activeWork =
          vscode.workspace.getWorkspaceFolder(document)?.uri.path;

        const getLangTsPath = (key: string) => {
          const startWith = xlsxTransformPath.startsWith("/");
          const endWith = xlsxTransformPath.endsWith("/");
          const fidlesPath = startWith
            ? "xlsxTransformPath"
            : `/${xlsxTransformPath}`;
          return `${activeWork}${fidlesPath}${
            endWith ? "" : "/"
          }${key}.${xlsxTransformType}`;
        };

        const config = await prettier.resolveConfig("path/to/file", {
          useCache: false,
        });
        // 将Object转成ts
        Object.keys(l10n).forEach((key: string) => {
          const str = `export default ${JSON.stringify(l10n[key], null, 2)}\n`;
          const filePath = getLangTsPath(key);
          prettier
            .format(str, { ...config, semi: false, filepath: filePath })
            .then((res: string) => {
              fs.writeFileSync(filePath, res, "utf8");
            });
        });
        vscode.window.showInformationMessage("文件转换完成");
      }
    } catch (err) {
      vscode.window.showErrorMessage("文件转换失败", JSON.stringify(err));
    }
  },
  // 生成React组件
  createRfc: async (document: vscode.Uri) => {
    const fileName = await vscode.window.showInputBox({
      prompt: "请输入文件名",
      value: "index.ts",
    });
    if (!fileName) {
      return;
    }
    const isTsx = fileName.endsWith(".tsx");
    (global as any).document = document;
    const componentName = await vscode.window.showInputBox({
      prompt: "请输入组件名",
      value: "",
    });

    if (!componentName) {
      return;
    }

    const fileContent = isTsx
      ? tsxContent(componentName)
      : jsxContent(componentName);

    const config = await prettier.resolveConfig("path/to/file", {
      useCache: false,
    });

    const filePath = `${document.path}/${fileName}`;
    prettier
      .format(fileContent, { ...config, semi: false, filepath: filePath })
      .then((res) => {
        fs.writeFileSync(filePath, res, "utf8");
      });
  },
  // 生成vue组件
  createVue: async (document: vscode.Uri) => {
    const fileName = await vscode.window.showInputBox({
      prompt: "请输入文件名",
      value: "index.vue",
    });
    if (!fileName) {
      return;
    }
    const isTsx = fileName.endsWith(".tsx");
    (global as any).document = document;
    const componentName = await vscode.window.showInputBox({
      prompt: "请输入组件名",
      value: "",
    });

    if (!componentName) {
      return;
    }

    const fileContent = isTsx
      ? vueTsxContent(componentName)
      : vueTemplateContent(componentName);

    const config = await prettier.resolveConfig("path/to/file", {
      useCache: false,
    });

    const filePath = `${document.path}/${fileName}`;
    fs.writeFileSync(filePath, fileContent, "utf8");
  },
  // 生成class
  createClass: async (document: vscode.Uri) => {
    const fileName = await vscode.window.showInputBox({
      prompt: "请输入文件名",
      value: "index.ts",
    });
    if (!fileName) {
      return;
    }
    (global as any).document = document;
    const className = await vscode.window.showInputBox({
      prompt: "请输入类名",
      value: "",
    });

    if (!className) {
      return;
    }

    const fileContent = classContent(className);

    const config = await prettier.resolveConfig("path/to/file", {
      useCache: false,
    });

    const filePath = `${document.path}/${fileName}`;
    prettier
      .format(fileContent, {
        ...config,
        semi: false,
        filepath: filePath,
      })
      .then((res) => {
        fs.writeFileSync(filePath, res, "utf8");
      });
  },
};
