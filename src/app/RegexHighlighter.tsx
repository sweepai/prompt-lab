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
      console.log(match, args)
      const matchStart = args[args.length - 2];
      const matchEnd = matchStart + match.length;

      result.push(<span key={`unmatched-${lastIndex}`}>{text.substring(lastIndex, matchStart)}</span>);

      let currentIndex = matchStart;

      const colorChanges: [number, number, boolean][] = [];

      var firstEnd = matchEnd + 1;

      // @ts-ignore
      regex.exec(match)!.indices.forEach(([start, end]: [number, number], index: number) => { 
        console.log(start ,end)
        colorChanges.push([start + matchStart, index, true]);
        colorChanges.push([end + matchStart, index, false]);
        if (start > 0) {
          firstEnd = Math.min(firstEnd, start + matchStart);
        }
      })

      colorChanges.sort((a, b) => a[0] - b[0]);
      console.log(colorChanges)

      var depth = 0;
      for (let i = 0; i < colorChanges.length - 1; i++) {
        const [index, colorIndex, isStart] = colorChanges[i];
        depth += isStart ? 1 : -1;
        result.push(
          <span key={`match-${currentIndex}`} style={{ backgroundColor: randomHexColor(depth - 1) }}>
            {text.substring(index, colorChanges[i + 1][0])}
          </span>
        );
      }

      lastIndex = matchEnd;
      return match;
    });

    if (lastIndex < text.length) {
      result.push(<span key={`remaining-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return result;
  };

  return (
    <div>
      {getHighlightedText()}
    </div>
  );
};

export default RegexHighlighter;