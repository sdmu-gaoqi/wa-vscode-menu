import * as vscode from "vscode";
import Extension from "./register";
import "./utils/common";

// registerCommands注册命令
export function activate(context: vscode.ExtensionContext) {
  const ex: Extension = new Extension();
  ex.registerCommands(context);
}
export function deactivate() {}
