import * as vscode from "vscode";
import FileFormatter from "./FileFormatter";
import { updateConfig } from "./settings";

export function activate(context: vscode.ExtensionContext) {
    //   The command has been defined in the package.json file
    //   Now provide the implementation of the command with registerCommand
    //   The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "4gl-formatter.activate",
        () => {
            updateConfig();
            vscode.window.showInformationMessage("4gl formatter activated");
        }
    );
    context.subscriptions.push(disposable);

    let fourGlFormatter = vscode.languages.registerDocumentFormattingEditProvider("4gl", {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            let formatter = new FileFormatter();
            formatter.setLines(document.getText().split("\n"));
            formatter.processLines();
            let textEditResult: vscode.TextEdit[] = []
            formatter.getOutLines().forEach((line, i) => {
                textEditResult.push(vscode.TextEdit.delete(document.lineAt(i).range));
                textEditResult.push(vscode.TextEdit.insert(document.lineAt(i).range.start, line));
            });
            return textEditResult;
        },
    });
    context.subscriptions.push(fourGlFormatter);


    function onConfigChange(e: vscode.ConfigurationChangeEvent): void {
        if (!e.affectsConfiguration("4gl-formatter")) {
            return;
        }
        updateConfig();
    }
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(onConfigChange));
}

export function deactivate() { }
