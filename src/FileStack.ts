import * as vscode from "vscode";
import { IndentMode, options } from "./settings";

interface Node {
    content: vscode.TextLine;
    line: number;
    stackSize: number;
    getComment: (node: Node) => string;
}

interface CommentMatch {
    decoration: vscode.TextEditorDecorationType;
    decorationOption: vscode.DecorationOptions;
}

export class FileStack {
    private _stack: Node[];
    private _document: vscode.TextDocument;
    private _deco_info: CommentMatch[];
    private _deco_err: CommentMatch[];

    constructor(document: vscode.TextDocument) {
        this._stack = [];
        this._document = document;

        this._deco_err = [];
        this._deco_info = [];
    }

    pushStack(text: vscode.TextLine, index: number): void {
        this._stack.push({
            content: text,
            line: index,
            stackSize: this._stack.length,
            getComment: this.getCommentMode(),
        });
    }

    createComment(comment: string, error?: boolean): vscode.TextEditorDecorationType {
        return vscode.window.createTextEditorDecorationType({ after: { contentText: comment, color: error ? 'red' : 'gray' } })
    }

    // return the top elem of the stack if not null
    getTopStackComment(text: vscode.TextLine, current_index: number): void {
        const top_node = this._stack.slice(-1)[0];
        let range = text.range;
        if (top_node !== undefined) {
            this._deco_info.push({
                decorationOption: { range },
                decoration: this.createComment(top_node.getComment(top_node))
            });
            return;
        }
        this._deco_err.push({
            decorationOption: { range },
            decoration: this.createComment("unable to find an opening statement", true)
        });
    }

    // Same but delete it
    popTopStackComment(text: vscode.TextLine, current_index: number): void {
        const top_node = this._stack.pop();
        let range = text.range;

        if (top_node !== undefined) {
            this._deco_info.push({
                decorationOption: { range },
                decoration: this.createComment(top_node.getComment(top_node))
            });
            return;
        }
        this._deco_err.push({
            decorationOption: { range },
            decoration: this.createComment("unable to find an opening statement", true)
        });
    }

    checkStackStatus() {
        if (this._stack.length === 0) {
            return;
        } else {
            this._stack.forEach((node) => {
                let range = node.content.range;
                this._deco_err.push({
                    decorationOption: { range },
                    decoration: this.createComment("no closing statement", true)
                });
            });
        }
    }

    /**
     * return the fonction that create the indentation comment matching the one chosen in commandline arguments
     * @returns
     */
    private getCommentMode(): (node: Node) => string {
        const mode_comment_func_ptr = [
            [IndentMode.MODE_CONDITION, FileStack.modeCondition],
            [IndentMode.MODE_LINE, FileStack.modeLine],
            [IndentMode.MODE_NUMBER, FileStack.modeNumber],
            [IndentMode.MODE_NONE, FileStack.modeNone],
        ];
        for (const [mode, callbackComment] of mode_comment_func_ptr) {
            if (options.mode === <IndentMode>mode) {
                return <(node: Node) => string>callbackComment;
            }
        }
        throw undefined;
    }

    private static modeNone({ }: Node): string {
        return "";
    }

    private static modeCondition(node: Node): string {
        return (
            "  { " +
            (node.content.text.length > 10
                ? node.content.text.substr(3, 40)
                : node.content.text.slice(3)) +
            " }"
        );
    }

    private static modeNumber(node: Node): string {
        return (
            "  { " +
            Array.from(Array(node.stackSize + 1).keys())
                .map((val) => val + 1)
                .join(".") +
            " }"
        );
    }

    private static modeLine(node: Node): string {
        return `  { Match Line ${node.line + 1} }`;
    }

    public getDecoErr() {
        return this._deco_err;
    }

    public getDecoInfo() {
        return this._deco_info;
    }
}
