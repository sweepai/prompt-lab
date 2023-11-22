type RegexHighlighterProps = {
  text: string;
  regex: RegExp;
};

function randomHexColor(seed: number) {
  return [
    "darkgreen", "darkred", "darkblue", "brown"
  ][seed % 5]
}

const RegexHighlighter: React.FC<RegexHighlighterProps> = ({ text, regex }) => {
  const getHighlightedText = () => {
    const result: JSX.Element[] = [];
    let lastIndex = 0;

    text.replace(regex, (match, ...args) => {
      const matchStart = args[args.length - 2];
      const matchEnd = matchStart + match.length;

      result.push(<span className={`unmatched-${lastIndex}`}>{text.substring(lastIndex, matchStart)}</span>);

      let currentIndex = matchStart;

      const colorChanges: [number, boolean][] = [];

      var firstEnd = matchEnd + 1;
      const exec_match = regex.exec(match)
    //   console.log("regex.exec(match)", exec_match)

      if (exec_match == null || exec_match.indices === undefined) {
        // console.log(exec_match)
        return match;
      }

      // @ts-ignore
      exec_match.indices.forEach(([start, end]: [number, number]) => {
        colorChanges.push([start + matchStart, true]);
        colorChanges.push([end + matchStart, false]);
        if (start > 0) {
          firstEnd = Math.min(firstEnd, start + matchStart);
        }
      })

      colorChanges.sort((a, b) => a[0] - b[0]);

      var depth = 0;
      for (let i = 0; i < colorChanges.length - 1; i++) {
        const [index, isStart] = colorChanges[i];
        depth += isStart ? 1 : -1;
        result.push(
          <span className={`match-${currentIndex}`} style={{ backgroundColor: randomHexColor(depth - 1) }}>
            {text.substring(index, colorChanges[i + 1][0])}
          </span>
        );
      }

      lastIndex = matchEnd;
      return match;
    });

    if (lastIndex < text.length) {
      result.push(<span className={`remaining-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return result;
  };

  const highlightedText = getHighlightedText()
  console.log("highlightedText", highlightedText)

  return (
    <div className="font-mono p-2 bg-gray-900 border border-gray-700 rounded p-2 font-mono w-full">
      {highlightedText}
    </div>
  );
};

export default RegexHighlighter;