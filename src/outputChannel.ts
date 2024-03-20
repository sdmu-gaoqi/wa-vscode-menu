import * as vscode from "vscode";

class OutputChannel {
  public channel: vscode.OutputChannel;
  public constructor(channelName: string) {
    this.channel = vscode.window.createOutputChannel(channelName);
  }
  public log(message: string) {
    this.channel.appendLine(message);
  }
}

export default OutputChannel;
