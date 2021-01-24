export enum IndentMode {
  MODE_CONDITION = "condition",
  MODE_NUMBER = "number",
  MODE_NONE = "none",
  MODE_LINE = "line",
}

export let options = {
  indent: "\t",
  mode: IndentMode.MODE_LINE,
};
