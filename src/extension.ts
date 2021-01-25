import * as vscode from "vscode";
import FileFormatter from "./FileFormatter";
import { updateConfig } from "./settings";

export function activate(context: vscode.ExtensionContext) {
    //   The command has been defined in the package.json file
    //   Now provide the implementation of the command with registerCommand
    //   The commandId parameter must match the command field in package.json
    let actiavte = vscode.commands.registerCommand(
        "4gl-formatter.activate",
        () => {
            updateConfig();
            vscode.window.showInformationMessage("4gl formatter activated");
        }
    );
    context.subscriptions.push(actiavte);

    let fourGlFormatter = vscode.languages.registerDocumentFormattingEditProvider("4gl", {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            let formatter = new FileFormatter(document);
            formatter.processLines();
            return formatter.getOutLines();
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
