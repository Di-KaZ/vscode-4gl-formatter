import * as vscode from "vscode";
import FileFormatter from "./FileFormatter";
import { updateConfig } from "./settings";

let formatter = new FileFormatter();

export function activate(context: vscode.ExtensionContext) {
    let actiavte = vscode.commands.registerCommand(
        "4gl-formatter.activate",
        () => {
            updateConfig();
            vscode.window.showInformationMessage("4gl formatter activated");
        }
    );
    context.subscriptions.push(actiavte);

    // Create the new formatter
    let fourGlFormatter = vscode.languages.registerDocumentFormattingEditProvider("4gl", {
        provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
            formatter.setDocument(document);
            formatter.processLines();
            return formatter.getOutLines();
        },
    });
    context.subscriptions.push(fourGlFormatter);

    vscode.workspace.onWillSaveTextDocument(e => {
        let editor = vscode.window.visibleTextEditors
            .filter(editorr => editorr.document.uri === e.document.uri)[0];

        // Getting Match decorators
        let infoMatchs = formatter.getDecoInfo();
        infoMatchs.forEach(info => editor.setDecorations(info.decoration, [info.decorationOption]))

        // Getting error decorators
        let infoErr = formatter.getDecoErr();
        infoErr.forEach(info => editor.setDecorations(info.decoration, [info.decorationOption]))
    })


    // update config when needed
    function onConfigChange(e: vscode.ConfigurationChangeEvent): void {
        if (!e.affectsConfiguration("4gl-formatter")) {
            return;
        }
        updateConfig();
    }
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(onConfigChange));
}

export function deactivate() { }
