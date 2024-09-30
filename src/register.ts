import * as vscode from "vscode";
import { ChatWebview } from "./webviews/translate";
import { log } from "./utils/log";
import AesDecrypt from "./provider/waAesDecrypt";

export default class Extension {
  constructor() {}

  public registerCommands(context: vscode.ExtensionContext): void {
    const sideMenusService = new AesDecrypt("", context);
    log("registerCommands");
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        "wa-translate",
        new ChatWebview(context)
      )
    );

    context.subscriptions.push(
      vscode.window.createTreeView("wa-aes-decrypt", {
        treeDataProvider: sideMenusService,
        showCollapseAll: true,
      })
    );
    // context.subscriptions.push(
    //   vscode.window.registerWebviewViewProvider(
    //     "wa-aes-decrypt",
    //     new SideMenusService("")
    //   )
    // );
  }
}
