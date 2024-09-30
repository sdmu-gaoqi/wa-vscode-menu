import * as vscode from "vscode";
import { log } from "../utils/log";

class AesDecrypt implements vscode.TreeDataProvider<any> {
  constructor(
    private workspaceRoot: string | undefined,
    private context: vscode.ExtensionContext
  ) {
    log("sideMenusService");
  }

  async initialize() {
    log("hhhhhh");
    this.createAesInput();
    // this.context.subscriptions.push(
    //   vscode.commands.registerCommand(
    //     "issue.createIssueFromSelection",
    //     () => {
    //       return this.createAesInput();
    //     },
    //     this
    //   )
    // );
  }

  async createAesInput() {
    let document: vscode.TextDocument;
    const quickInput = vscode.window.createInputBox();
    quickInput.show();
    return undefined;
  }

  getChildren(element: any) {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No dependency in empty workspace");
      return Promise.resolve([]);
    }
    return Promise.resolve([]);
  }
  getTreeItem(element: any) {
    log(element);
    return element;
  }
}

export default AesDecrypt;
