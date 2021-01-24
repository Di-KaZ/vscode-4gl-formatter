import * as vscode from "vscode";

export class Printer {
    private static outputLog = vscode.window.createOutputChannel("Moussed's informix 4gl formatter")
    // pretty self explainatory
    public static info(msg: string): void {
        this.outputLog.appendLine(`[INFO] ${msg}`);
    }

    // same here 😎
    public static error(msg: string): void {
        this.outputLog.appendLine(`[ERR] ${msg}`);
    }

    // ...
    public static warn(msg: string): void {
        this.outputLog.appendLine(`[WARN] ${msg}`);
    }
}
