import * as vscode from "vscode";
import { commands } from "./commands";
import SideMenusService from "./provider/waSideMenus";
import { ChatWebview } from "./webviews/translate";

const sideMenusService = new SideMenusService("");
export default class Extension {
  constructor() {}

  public registerCommands(context: vscode.ExtensionContext): void {
    // 注册普通指令
    commands.forEach((item) => {
      const command = vscode.commands.registerCommand(item.key, item.func);
      context.subscriptions.push(command);
    });
    // 创建侧边视图
    context.subscriptions.push(
      // vscode.window.createTreeView("wa-sideMenus", {
      //   treeDataProvider: sideMenusService,
      //   showCollapseAll: true,
      // })
      vscode.window.registerWebviewViewProvider(
        "wa-sideMenus",
        new ChatWebview(),
        {
          webviewOptions: {
            retainContextWhenHidden: true,
          },
        }
      )
    );
  }
}
