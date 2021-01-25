import * as vscode from 'vscode';
import FileFormatter from './FileFormatter';
import { updateConfig } from './settings';

export function activate(context: vscode.ExtensionContext) {
	// I don't have time to implement it via formatter api so...
	let format = vscode.commands.registerCommand('4gl-formatter.format-4gl-file', () => {
		const { activeTextEditor } = vscode.window;
		if (activeTextEditor) {
			const { document } = activeTextEditor;
			let formatter = new FileFormatter();
			formatter.setDocument(document);
			formatter.processLines();
			vscode.workspace.applyEdit(formatter.getOutLines());
			let infoMatchs = formatter.getDecoInfo();
			infoMatchs.forEach((info) => activeTextEditor.setDecorations(info.decoration, [info.decorationOption]));
			let infosErr = formatter.getDecoErr();
			infosErr.forEach((info) => activeTextEditor.setDecorations(info.decoration, [info.decorationOption]));
		}
		vscode.window.showInformationMessage('Formatted file succesfully');
	});

	// context.subscriptions.push(actiavte);
	context.subscriptions.push(format);

	// update config when needed
	function onConfigChange(e: vscode.ConfigurationChangeEvent): void {
		if (!e.affectsConfiguration('4gl-formatter')) {
			return;
		}
		updateConfig();
	}
	context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(onConfigChange));
}

export function deactivate() {}
