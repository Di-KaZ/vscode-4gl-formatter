interface Colors {
  RESET: string;
  BRIGHT: string;
  DIM: string;
  UNDERSCORE: string;
  BLINK: string;
  REVERSE: string;
  HIDDEN: string;
  FGBLACK: string;
  FGRED: string;
  FGGREEN: string;
  FGYELLOW: string;
  FGBLUE: string;
  FGMAGENTA: string;
  FGCYAN: string;
  FGWHITE: string;
  BGBLACK: string;
  BGRED: string;
  BGGREEN: string;
  BGYELLOW: string;
  BGBLUE: string;
  BGMAGENTA: string;
  BGCYAN: string;
  BGWHITE: string;
}

export const COLORS: Colors = {
  RESET: "\x1b[0m",
  BRIGHT: "\x1b[1m",
  DIM: "\x1b[2m",
  UNDERSCORE: "\x1b[4m",
  BLINK: "\x1b[5m",
  REVERSE: "\x1b[7m",
  HIDDEN: "\x1b[8m",
  FGBLACK: "\x1b[30m",
  FGRED: "\x1b[31m",
  FGGREEN: "\x1b[32m",
  FGYELLOW: "\x1b[33m",
  FGBLUE: "\x1b[34m",
  FGMAGENTA: "\x1b[35m",
  FGCYAN: "\x1b[36m",
  FGWHITE: "\x1b[37m",
  BGBLACK: "\x1b[40m",
  BGRED: "\x1b[41m",
  BGGREEN: "\x1b[42m",
  BGYELLOW: "\x1b[43m",
  BGBLUE: "\x1b[44m",
  BGMAGENTA: "\x1b[45m",
  BGCYAN: "\x1b[46m",
  BGWHITE: "\x1b[47m",
};

const version = "0.1.0";

export const FORMATTED_EXT = "-formatted.4gl";

export const HELP: string =
  `${COLORS.UNDERSCORE}== Moussed's informix 4gl formatter ver. ${version} ==\n${COLORS.RESET}\n` +
  `${COLORS.FGMAGENTA}[USAGE]\n` +
  `\t${COLORS.FGGREEN}-f${COLORS.RESET} (filepath) ${COLORS.FGMAGENTA}or ${COLORS.FGGREEN}-d${COLORS.RESET} (dirpath)\n` +
  `${COLORS.FGMAGENTA}[OPTIONAL]\n` +
  `\t${COLORS.FGGREEN}-i ${COLORS.FGMAGENTA}(indentation to use)\t${COLORS.RESET} default ${COLORS.FGMAGENTA}('\\t')${COLORS.RESET}\n` +
  `\t${COLORS.FGGREEN}-o ${COLORS.FGMAGENTA}(output directory path)${COLORS.RESET} default ${COLORS.FGMAGENTA}(executable directory)${COLORS.RESET}\n` +
  `\t${COLORS.FGGREEN}-l ${COLORS.FGMAGENTA}(condition|number|none)${COLORS.RESET} Identation mode to use default ${COLORS.FGMAGENTA}(condition)${COLORS.RESET}\n` +
  `\t${COLORS.FGGREEN}\tnone\t${COLORS.RESET}  display nothing\n` +
  `\t\t${COLORS.FGGREEN}condition${COLORS.RESET} display the first 40 char of the opening statement on the mathching intermediate && end statement\n` +
  `\t\t${COLORS.FGGREEN}number\t${COLORS.RESET}  display the inner depth of the opening statement on the mathching intermediate && end statement\n`;

export class Printer {
  // pretty self explainatory
  public static info(msg: string): void {
    console.info(`${COLORS.FGGREEN}[INFO] ${COLORS.RESET} ${msg}`);
  }

  // same here 😎
  public static error(msg: string): void {
    console.error(`${COLORS.FGRED}[ERROR] ${COLORS.RESET} ${msg}`);
  }

  // ...
  public static warn(msg: string): void {
    console.warn(`${COLORS.FGYELLOW}[WARN]${COLORS.RESET} ${msg}`);
  }
}
