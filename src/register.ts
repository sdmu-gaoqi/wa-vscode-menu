import * as vscode from "vscode";
import SideMenusService from "./provider/waSideMenus";
import { ChatWebview } from "./webviews/translate";

export default class Extension {
  constructor() {}

  public registerCommands(context: vscode.ExtensionContext): void {
    context.subscriptions.push(
      vscode.window.createTreeView("wa-translate", {
        showCollapseAll: true,
        treeDataProvider: new SideMenusService("wa-translate"),
      })
    );
    vscode.window.registerWebviewViewProvider(
      "wa-translate",
      new ChatWebview(),
      {
        webviewOptions: {
          retainContextWhenHidden: false,
        },
      }
    ),
      vscode.window.registerWebviewViewProvider(
        "wa-aes-decrypt",
        new ChatWebview(),
        {
          webviewOptions: {
            retainContextWhenHidden: true,
          },
        }
      );
  }
}
