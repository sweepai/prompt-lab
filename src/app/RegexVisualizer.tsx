"use client"

import { useRef, useState } from "react"
import RegexHighlighter from "./RegexHighlighter"

const RegexVisualizer = ({text}: {text: string}) => {
    const defaultRegex = "text (to) be high(li(g)ht)ed"
    const [regex, setRegex] = useState<RegExp>(new RegExp(defaultRegex, "dgs"))
    const ref = useRef<HTMLInputElement>(null)
    const onChange = () => {
        if (ref.current) {
            setRegex(new RegExp(ref.current.value, "dgs"))
        }
    }
    return (
        <div>
            <h1>Regex Visualizer</h1>
            <input type="text" ref={ref} onChange={onChange} defaultValue={defaultRegex} />
            <br />
            <RegexHighlighter regex={regex} text={text}/>
        </div>
    )
}

export default RegexVisualizer