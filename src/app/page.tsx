import React from "react";
// import RegexHighlighter from "./RegexHighlighter";
import RegexVisualizer from "./RegexVisualizer";
import "./Highlighter.css"; // Import the CSS file for styling

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="h-screen w-full flex">
        <div className="w-1/3">Chat history goes here.</div>
        <div className="w-2/3">
          {/* <RegexHighlighter regex={/text (to) be high(li(g)ht)ed/dgs} text="text to be highlighted" /> */}
          <RegexVisualizer text="text to be highlighted" />
        </div>
      </div>
    </main>
  )
}
