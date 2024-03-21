/**
 * @file 指令实际实现
 * */

import path = require("path");
import * as vscode from "vscode";
import * as xlsx from "xlsx";
import * as fs from "fs";
import * as prettier from "prettier";
import * as md5 from "md5";
import axios from "axios";
import { getInitConstants } from "./initConstants";
import {
  baiduLangs,
  classContent,
  jsxContent,
  tsxContent,
  vueTemplateContent,
  vueTsxContent,
} from "./constants/content";
import { channel } from "./utils";

const baseAxios = axios.create({});

// 获取百度api翻译语言
export const getTranslateLan = (lan: string) => {
  const lanStr = lan.toLocaleLowerCase();
  switch (lanStr) {
    case "zh":
    case "zh-cn":
      return "zh";
    case "en":
    case "en-us":
      return "en";
    case "ja":
    case "ja-jp":
      return "jp";
    case "ko":
    case "kr":
    case "ko-kr":
      return "kor";
    case "zh-tw":
    case "zh-cnt":
    case "zh-cht":
      return "cht";
    default:
      return "en";
  }
};

// api翻译
export const translateServer = async ({
  content,
  lan,
  translate,
  document,
  toLang,
  fromLang,
  config,
}: {
  content: string;
  lan: string;
  translate: boolean;
  document: vscode.Uri;
  toLang?: string;
  fromLang?: string;
  config?: {
    defaultLang: string;
    baiduAppid: string;
    baiduKey: string;
  };
}) => {
  if (!translate) {
    return "";
  }
  const { defaultLang, baiduAppid, baiduKey } = config
    ? config
    : await getInitConstants(document);
  const translateLan = toLang ? toLang : getTranslateLan(lan);
  const oldLang =
    typeof fromLang === "string" ? fromLang : getTranslateLan(defaultLang);
  const salt = +new Date();
  const sign = md5(`${baiduAppid}${content}${salt}${baiduKey}`);
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${content}&from=${oldLang}&to=${translateLan}&appid=${baiduAppid}&salt=${salt}&sign=${sign}`;

  const data = await baseAxios.request({
    url,
  });

  return data?.data?.trans_result?.[0]?.dst;
};

export const functions = {
  // xlsx转ts
  xlsxToTs: async (document: vscode.Uri) => {
    try {
      //   const pathFile = await vscode.workspace.openTextDocument(document.fsPath);
      (global as any).xlsx = xlsx;
      (global as any).pathFile = document;
      const {
        xlsxTransformPath,
        xlsxTransformType,
        defaultLang,
        autoTranslate,
        baiduAppid,
        baiduKey,
      } = await getInitConstants(document);
      const translate =
        Boolean(autoTranslate) && Boolean(baiduAppid) && Boolean(baiduKey);
      const data = fs.readFileSync(document.fsPath).buffer;
      const file = xlsx.read(data);
      const l10n: Record<string, Record<string, string>> = {};
      for (const sheetName of file.SheetNames) {
        const sheetData: any = xlsx.utils.sheet_to_json(file.Sheets[sheetName]);
        const fields = Object.keys(sheetData[0]);

        await Promise.all(
          sheetData.map(async (word: Record<string, string>) => {
            // 0是key
            for (let index = 1; index < fields.length; index++) {
              const field = fields[index];
              if (!l10n[field]) {
                l10n[field] = {};
              }
              if (word[field]) {
                l10n[field][word.key] = word[field];
              } else {
                try {
                  const result =
                    (await translateServer({
                      content: word[defaultLang],
                      lan: field,
                      translate,
                      document,
                    })) || word[defaultLang];
                  l10n[field][word.key] = result || "";
                } catch (err) {
                  l10n[field][word.key] = word[defaultLang] || "";
                }
              }
            }
          })
        );
      }
      const activeWork =
        vscode.workspace.getWorkspaceFolder(document)?.uri.fsPath;

      const getLangTsPath = (key: string) => {
        const startWith = xlsxTransformPath.startsWith("/");
        const endWith = xlsxTransformPath.endsWith("/");
        const fidlesPath = startWith
          ? xlsxTransformPath
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
    } catch (err) {
      console.log(err, "errerrerrerrerrerr");
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

    const filePath = `${document.fsPath}/${fileName}`;
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

    const filePath = `${document.fsPath}/${fileName}`;
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

    const filePath = `${document.fsPath}/${fileName}`;
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
  // 翻译
  translate: async (document: vscode.Uri) => {
    const config = {
      defaultLang: "",
      baiduAppid: (vscode.workspace.getConfiguration().get("baiduAppid") ||
        "") as string,
      baiduKey: (vscode.workspace.getConfiguration().get("baiduKey") ||
        "") as string,
    };
    // 弹出vscode选择框
    const oldLang = await vscode.window.showQuickPick(baiduLangs, {
      placeHolder: "请选择当前语言",
    });
    // 弹出vscode输入框
    const content = await vscode.window.showInputBox({
      prompt: "请输入需要翻译的内容",
      value: "",
    });
    // 弹出vscode选择框
    const data = await vscode.window.showQuickPick(baiduLangs, {
      placeHolder: "请选择需要翻译语言",
    });
    if (!content || !data?.command) {
      return;
    }
    try {
      const result = await translateServer({
        content,
        lan: data?.command,
        toLang: data?.command,
        fromLang: oldLang?.command,
        translate: true,
        document,
        config,
      });
      channel.log("本次翻译内容：");
      channel.log(content);
      channel.log("本次翻译结果：");
      channel.log(result);
      channel.log("--------------------------");
    } catch (err) {
      console.log(err, "csvToTs");
    }
  },
};
