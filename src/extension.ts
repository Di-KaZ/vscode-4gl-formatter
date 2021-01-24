import * as vscode from "vscode";
import FileFormatter from "./FileFormatter";

export function activate(context: vscode.ExtensionContext) {
    //   The command has been defined in the package.json file
    //   Now provide the implementation of the command with registerCommand
    //   The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "4gl-formatter.helloWorld",
        () => {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            vscode.window.showInformationMessage("Hello Bitches");
        }
    );
    context.subscriptions.push(disposable);

    let test = vscode.languages.registerDocumentFormattingEditProvider("4gl", {
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
    context.subscriptions.push(test);
}

export function deactivate() { }
