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
    private _out_lines: string[]; // formatted lines
    private _current_line_index: number; // current line that we are formatting
    private _indent_level: number; // current indentation depth
    private _stack: FileStack;
    private _lines: string[];
    private _indent: string;

    /**
     * Create a file instance
     * @param base_name
     * @param out_directory
     * @param indent_chars
     */
    public constructor() {
        this._lines = [];
        this._current_line_index = 0;
        this._out_lines = [];
        this._indent_level = 0;
        this._stack = new FileStack();
        this._indent = options.indentation === Indent.TAB ? "\t" : "    "
    }

    /**
     * Set the lines contained in the file
     * @param lines
     */
    public setLines(lines: string[]): void {
        this._lines = lines;
    }

    /**
     * Process line of the file one by one
     */
    public processLines(): void {
        const timer_Start = new Date().getTime();
        Printer.info(`Formatting file`);
        // tant qu'il y a des lignes a traité on s'en occupe
        while (this._current_line_index < this._lines.length) {
            this.processLine();
            this._current_line_index += 1;
        }
        // check if errors in file are detected by the stack
        this._stack.checkStackStatus();
        // print formatted lines in out file
        Printer.info(`Done Formatting file in ${(new Date().getTime() - timer_Start) / 1000} seconds !`);
    }

    public getOutLines(): string[] {
        return this._out_lines;
    }

    /**
     * Temporary for the match commenting feature as its print it at every formatteing trigger
     * this prevent it but if we change mode i'ts not working anymore
     * @param line
     * @param comment
     * @returns
     */
    private checkIfLineAlereadyCommented(line: string, comment: string): string {
        if (!line.includes(comment)) {
            return line + comment;
        }
        return line;
    }
    /**
     * check if the like is an opening statement or a closing one to print the comment after
     * @param line
     * @returns line + comment
     */
    private manageIfStack(line: string): string {
        // if we found a new nesting token like an if add it to the stack
        if (TOKENS.PUSH_STACK.test(line)) {
            this._stack.pushStack(line, this._current_line_index);
            return (
                this.checkIfLineAlereadyCommented(line, this._stack.getTopStackComment(this._current_line_index + 1))
            );
        }
        // if it's an intermediate token like an else juste add the comment
        if (TOKENS.PRINT_LIBL_STACK.test(line)) {
            return (
                this.checkIfLineAlereadyCommented(line, this._stack.getTopStackComment(this._current_line_index + 1))
            );
        }
        // if we close the statement pop the stack
        if (TOKENS.POP_STACK.test(line)) {
            return (
                this.checkIfLineAlereadyCommented(line, this._stack.popTopStackComment(this._current_line_index + 1))
            );
        }
        return line;
    }

    /**
     * format current line and prepare the next one
     * @returns
     */
    private processLine(): void {
        let line: string = this._lines[this._current_line_index];

        // if line is just empty or just a signle line comment print it
        if (TOKENS.EMPTY_LINE_OR_COMMENT.test(line)) {
            this._out_lines.push(
                this._indent.repeat(this._indent_level) + line.trimLeft()
            );
            return;
        }

        // if mutiline comment search for end of it /!\ do not manage charracter after the closing } (need to be on a newline) TODO
        if (TOKENS.MULTI_LINE_COMMENT_OPEN.test(line)) {
            while (TOKENS.MULTI_LINE_COMMENT_CLOSE.test(line) === false) {
                this._out_lines.push(line);
                this._current_line_index += 1;
                line = this._lines[this._current_line_index];
            }
            this._out_lines.push(line);
            return;
        }

        // if not empty or a comment //
        // delete before and after space to clean up indentation and search token from start of string
        line = line.trim();
        if (options.mode !== IndentMode.MODE_NONE) {
            line = this.manageIfStack(line);
        }

        // check if we have to decrement indentation
        if (TOKENS.DECREMENT_STATEMENT.test(line)) {
            this._indent_level > 0
                ? (this._indent_level -= 1)
                : (this._indent_level = 0);
        }

        // or reset it
        if (TOKENS.RESET_STATEMENT.test(line)) {
            this._indent_level = 0;
        }
        // output line with indentation
        this._out_lines.push(this._indent.repeat(this._indent_level) + line);

        // set indentation fo next line
        if (TOKENS.INCREMENT_STATEMENT.test(line)) {
            this._indent_level += 1;
        }
    }
}
