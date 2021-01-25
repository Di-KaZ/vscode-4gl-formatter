import * as vscode from 'vscode';

export enum IndentMode {
	MODE_CONDITION = 'condition',
	MODE_NUMBER = 'number',
	MODE_NONE = 'none',
	MODE_LINE = 'line',
}

export enum Indent {
	TAB = 'tab',
	SPACES = 'spaces',
}

export interface ISettings {
	indentation: Indent;
	indent: string;
	mode: IndentMode;
}

export let options: ISettings = {
	indentation: Indent.TAB,
	indent: '\t',
	mode: IndentMode.MODE_LINE,
};

export const FOUR_GL: vscode.DocumentSelector = { scheme: 'file', language: 'ifx-4gl' };

// function that update the extention settings
export function updateConfig(): void {
	options = (vscode.workspace.getConfiguration('4gl-formatter') as any) as ISettings;
}
