import * as vscode from "vscode";
import { ChatWebview } from "./webviews/translate";
import { log } from "./utils/log";

export default class Extension {
  constructor() {}

  public registerCommands(context: vscode.ExtensionContext): void {
    log("registerCommands");
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        "wa-translate",
        new ChatWebview(context)
      )
    );
    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        "wa-aes-decrypt",
        new ChatWebview(context)
      )
    );
  }
}
