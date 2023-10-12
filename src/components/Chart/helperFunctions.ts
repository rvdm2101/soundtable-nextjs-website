interface IFitTextToCircleLine {
  text: string;
  width: number;
}

export interface IFitTextToCircle {
  lines: IFitTextToCircleLine[];
  textRadius: number;
  lineHeight: number;
}

export const fitTextToCircle = (text: string): IFitTextToCircle => {
  const lineHeight = 16;

  const words = (function Words(textToSplit: string) {
    const wordsList = textToSplit.split(/\s+/g); // To hyphenate: /\s+|(?<=-)/
    if (!wordsList[wordsList.length - 1]) wordsList.pop();
    if (!wordsList[0]) wordsList.shift();
    return wordsList;
  })(text);

  const measureWidth = (textToMeasure: string) => {
    const context = document.createElement('canvas').getContext('2d');
    return context?.measureText(textToMeasure).width || 0;
  };
  const targetWidth = Math.sqrt(measureWidth(text.trim()) * lineHeight);

  const lines = (function Lines() {
    let line;
    let lineWidth0 = Infinity;
    const tempLines = [];
    for (let i = 0, n = words.length; i < n; ++i) {
      const lineText1: string = (line ? `${line.text} ` : '') + words[i];
      const lineWidth1 = measureWidth(lineText1);
      if ((lineWidth0 + lineWidth1) / 2 < targetWidth) {
        if (!line) {
          line = { width: 0, text: '' };
        }
        // eslint-disable-next-line no-multi-assign
        line.width = lineWidth0 = lineWidth1;
        line.text = lineText1;
      } else {
        lineWidth0 = measureWidth(words[i]);
        line = { width: lineWidth0, text: words[i] };
        tempLines.push(line);
      }
    }
    return tempLines;
  })();

  const textRadius = (function TextRadius() {
    let radius = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0, n = lines.length; i < n; i++) {
      const dy = (Math.abs(i - n / 2 + 0.5) + 0.5) * lineHeight;
      const dx = lines[i].width / 2;
      radius = Math.max(radius, Math.sqrt(dx ** 2 + dy ** 2));
    }
    return radius;
  })();

  return {
    textRadius,
    lines,
    lineHeight
  };
};

export const getLongestLineWidth = (lines: IFitTextToCircleLine[]): number =>
  lines.reduce(
    (carry, currentLine) => {
      if (currentLine.width > carry.width) {
        return currentLine;
      }
      return carry;
    },
    { text: '', width: 0 }
  ).width;

/**
 * @param backgroundColor in hex
 * @param lightColor in hex
 * @param darkColor in hex
 *
 * @return string in hex
 */
export const getFontColor = (
  backgroundColor: string,
  lightColor: string = '#fff',
  darkColor: string = '#000'
) => {
  const color =
    backgroundColor.charAt(0) === '#' ? backgroundColor.substring(1, 7) : backgroundColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor;
};
