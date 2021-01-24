import { Printer } from "./Printer";
import { IndentMode, options } from "./settings";

interface Node {
    content: string;
    line: number;
    stackSize: number;
    getComment: (node: Node) => string;
}

export class FileStack {
    private _stack: Node[];

    constructor() {
        this._stack = [];
    }

    pushStack(text: string, index: number): void {
        this._stack.push({
            content: text,
            line: index,
            stackSize: this._stack.length,
            getComment: this.getCommentMode(),
        });
    }

    // return the top elem of the stack if not null
    getTopStackComment(current_index: number): string {
        const top_node = this._stack.slice(-1)[0];

        if (top_node !== undefined) {
            return top_node.getComment(top_node);
        }
        Printer.error(
            `unable to find an opening statement for line ${current_index}`
        );
        return " { error: no openning statement }";
    }

    // Same but delete it
    popTopStackComment(current_index: number): string {
        const top_node = this._stack.pop();

        if (top_node !== undefined) {
            return top_node.getComment(top_node);
        }
        Printer.error(
            `unable to find an opening statement for line ${current_index}`
        );
        return " { error: no openning statement }";
    }

    checkStackStatus(): void {
        if (this._stack.length === 0) {
            return;
        } else {
            this._stack.forEach((node) => {
                Printer.error(
                    `no closing statement for line ${node.line + 1} : ` +
                    `'${node.content.length > 10
                        ? node.content.substr(0, 10) + "..."
                        : node.content
                    }'.`
                );
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
            (node.content.length > 10
                ? node.content.substr(3, 40)
                : node.content.slice(3)) +
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
}
