import {
  window,
  Position,
  WebviewView,
  WebviewViewProvider,
  ExtensionContext,
} from "vscode";
import { log } from "../../utils/log";
import registerPages from "../page";
export class ChatWebview implements WebviewViewProvider {
  // 写一个public变量，方便对象引用创建后的webview实例，但是可能存在还未完全解析完成时，访问值为null
  // 看了vscode api发现，resolveWebView 返回一个 Thenable，可以在解析完成后拿到webview实例
  // 但是这个函数是在webview容器第一次显示时自动执行，不需要手动调用，不知道怎么拿到Thenable
  public webview: WebviewView | null = null;
  constructor(protected context: ExtensionContext) {}

  resolveWebviewView(webviewView: WebviewView): void | Thenable<void> {
    this.webview = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };
    webviewView.webview.options = {
      enableScripts: true,
    };
    // 监听web端传来的消息
    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "WebSendMesToVscode":
          // 实现一个简单的功能，将web端传递过来的消息插入到当前活动编辑器中
          let editor = window.activeTextEditor;
          editor?.edit((edit) => {
            let position = editor?.selection
              ? editor?.selection.start
              : new Position(0, 0);
            edit.insert(position, message.data);
          });
          return;
      }
    }, undefined);
    // webview 展示的内容本身就是嵌套在一个iframe中，因此在此html中再嵌套一个iframe时，需要传递两次postMessage
    webviewView.webview.html = registerPages[this.webview.viewType];
  }

  public sendMessage() {
    log("sendMessage");
  }

  public postWebviewMessage() {
    log("postWebviewMessage");
  }
}
