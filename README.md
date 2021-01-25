# VSCode 4gl-formatter

![banner](https://raw.githubusercontent.com/Di-KaZ/vscode-4gl-formatter/main/img/ifx-4gl-formatter.png)

-----
![version](https://vsmarketplacebadge.apphb.com/version/GEETMOUSSED.4gl-formatter.svg
)    ![installs](https://vsmarketplacebadge.apphb.com/installs/GEETMOUSSED.4gl-formatter.svg) ![rating](https://vsmarketplacebadge.apphb.com/rating-short/GEETMOUSSED.4gl-formatter.svg)

## Features
Indent your 4gl code to make it easier to read :

# [Dowload Link (MarketPlace)](https://marketplace.visualstudio.com/items?itemName=GEETMOUSSED.4gl-formatter)
this code is lazily adapted from [this script I made](https://github.com/Di-KaZ/informix-4gl-formatter).
I will work on an adapted architecture and feature when I got the time to.

> ⚠ I didn't really searched much on how to write a vscode extention, please be gentle with me 😃

![preview](https://raw.githubusercontent.com/Di-KaZ/vscode-4gl-formatter/main/img/preview.gif)

![comments](https://raw.githubusercontent.com/Di-KaZ/vscode-4gl-formatter/main/img/comment_preview.PNG)

**Now display comments & errors as text decoration !**

## Extension Settings
![settings](https://raw.githubusercontent.com/Di-KaZ/vscode-4gl-formatter/main/img/preview_settings.PNG)

* `4gl-formatter.format-4gl-file -> "4gl Formatter : Format file"`:  format the active file

> you can see the log of the formatter in the **'OUT'** pane by selecting **"Moussed's 4gl formatter"**
 It shows some useful info , like when it find an orphan **if** or **else** statement in the file.

## Dependencies

[**install this extention that provide syntax highlight for 4gl**](https://marketplace.visualstudio.com/items?itemName=eurrutia.ifx-4gl)

## Known Issues


## Release Notes

### 0.1.0 - stable
 - Comments are now displaying as decoration rather that directly in the file
- Remove the use of vscode formatter api as it's easier like this for me

