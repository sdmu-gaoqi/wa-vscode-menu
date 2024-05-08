import * as vscode from "vscode";
import { channel } from "../utils";

class SideMenusService implements vscode.TreeDataProvider<any> {
  constructor(private workspaceRoot: string | undefined) {}
  getChildren(element: any) {
    channel.log(element);
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No dependency in empty workspace");
      return Promise.resolve([]);
    }
    return Promise.resolve([]);
  }
  getTreeItem(element: any) {
    return element;
  }
}

export default SideMenusService;
