import * as vscode from "vscode";
import { FileStack } from "./FileStack";
import { Printer } from "./Printer";
import { Indent, IndentMode, options } from "./settings";

interface Tokens {
    EMPTY_LINE_OR_COMMENT: RegExp;
    MULTI_LINE_COMMENT_OPEN: RegExp;
    MULTI_LINE_COMMENT_CLOSE: RegExp;
    // token that add indentation
    INCREMENT_STATEMENT: RegExp;
    // token that remove indentation
    DECREMENT_STATEMENT: RegExp;
    // token that reset indentation
    RESET_STATEMENT: RegExp;
    // token that push a condition libl in stack
    PUSH_STACK: RegExp;
    // token that pop condition libl in stack
    POP_STACK: RegExp;
    PRINT_LIBL_STACK: RegExp;
}

const TOKENS: Tokens = {
    EMPTY_LINE_OR_COMMENT: /^\s+$|^--.*$|^#.*$/m,
    MULTI_LINE_COMMENT_OPEN: /^{.*/,
    MULTI_LINE_COMMENT_CLOSE: /}.*/,
    INCREMENT_STATEMENT: /^MAIN\b|^IF\b|^ELSE\b|^CASE\b|^WHEN\b|^FOR\b|^FUNCTION\b|^WHILE\b|^FOREACH\b/i,
    DECREMENT_STATEMENT: /^ELSE\b|^END\b|^WHEN\b/i,
    RESET_STATEMENT: /^MAIN\b|^FUNCTION\b|^RECORD\b/i,
    PUSH_STACK: /^IF\b/i,
    POP_STACK: /^END IF\b/i,
    PRINT_LIBL_STACK: /^ELSE\b/i,
};

export default class FileFormatter {
    private _out_edit: vscode.TextEdit[]; // formatted lines
    private _current_line_index: number; // current line that we are formatting
    private _indent_level: number; // current indentation depth
    private _stack: FileStack | null;
    private _indent: string;
    private _document: vscode.TextDocument | null;

    /**
     * Create a file instance
     * @param base_name
     * @param out_directory
     * @param indent_chars
     */
    public constructor() {
        this._current_line_index = 0;
        this._out_edit = [];
        this._indent_level = 0;
        this._indent = options.indentation === Indent.TAB ? "\t" : "    "
        this._stack = null;
        this._document = null;
    }

    public setDocument(document: vscode.TextDocument): void {
        this._document = document;
        this._stack = new FileStack();
    }

    /**
     * Process line of the file one by one
     */
    public processLines() {
        Printer.info(`Formatting file`);
        // tant qu'il y a des lignes a traité on s'en occupe
        while (this._current_line_index < this._document!.lineCount) {
            this.processLine();
            console.log(this._current_line_index)
        }
        // finished formatting reporting problems found
        // check if errors in file are detected by the stack
        Printer.info(`Done Formatting file.`);
        this._stack!.checkStackStatus();
        return;
    }

    // return the formatted files lines
    public getOutLines(): vscode.TextEdit[] {
        return this._out_edit;
    }

    /**
     * check if the like is an opening statement or a closing one to print the comment after
     * @param line
     * @returns line + comment
     */
    private manageIfStack(line: vscode.TextLine): void {
        let text = line.text.trim();
        // if we found a new nesting token like an if add it to the stack
        if (TOKENS.PUSH_STACK.test(text)) {
            this._stack!.pushStack(line, this._current_line_index);
        } else if (TOKENS.PRINT_LIBL_STACK.test(text)) {
            // if it's an intermediate token like an else juste add the comment
            this._stack!.getTopStackComment(line, this._current_line_index + 1)
        }
        else if (TOKENS.POP_STACK.test(text)) {
            // if we close the statement pop the stack
            this._stack!.popTopStackComment(line, this._current_line_index + 1)
        }
    }

    /**
     * delete the current line and add formatted text on it
     * @param text
     */
    private addFormattedLine(text: string) {
        let line_range = this._document!.lineAt(this._current_line_index).range;
        this._out_edit.push(vscode.TextEdit.delete(line_range));
        this._out_edit.push(vscode.TextEdit.insert(line_range.start, text));
        this._current_line_index += 1; // increment the current line in file
    }

    /**
     * format current line and prepare the next one
     * @returns
     */
    private processLine(): void {
        // get the current line in file
        let text: string = this._document!.lineAt(this._current_line_index).text;

        // if line is just empty or just a signle line comment print it
        if (TOKENS.EMPTY_LINE_OR_COMMENT.test(text)) {
            this.addFormattedLine(text);
            return;
        }

        // if mutiline comment search for end of it /!\ do not manage charracter after the closing } (need to be on a newline) TODO
        if (TOKENS.MULTI_LINE_COMMENT_OPEN.test(text)) {
            while (TOKENS.MULTI_LINE_COMMENT_CLOSE.test(text) === false) {
                this.addFormattedLine(text);
                this._current_line_index += 1;
                text = this._document!.lineAt(this._current_line_index).text;
            }
            this.addFormattedLine(text);
            return;
        }

        // if not empty or a comment //
        // delete before and after space to clean up indentation and search token from start of string
        text = text.trim();

        if (options.mode !== IndentMode.MODE_NONE) {
            this.manageIfStack(this._document!.lineAt(this._current_line_index));
        }

        // check if we have to decrement indentation
        if (TOKENS.DECREMENT_STATEMENT.test(text)) {
            this._indent_level > 0
                ? (this._indent_level -= 1)
                : (this._indent_level = 0);
        }

        // or reset it
        if (TOKENS.RESET_STATEMENT.test(text)) {
            this._indent_level = 0;
        }

        // output line with indentation
        this.addFormattedLine(this._indent.repeat(this._indent_level) + text);

        // set indentation fo next line
        if (TOKENS.INCREMENT_STATEMENT.test(text)) {
            this._indent_level += 1;
        }
    }

    /**
     * returns the error decoration
     * @returns
     */
    public getDecoErr() {
        return this._stack!.getDecoErr();
    }

    /**
     * return match decoration
     * @returns
     */
    public getDecoInfo() {
        return this._stack!.getDecoInfo();
    }
}
