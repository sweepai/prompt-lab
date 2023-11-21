"use client"

import { useRef, useState } from "react"
import RegexHighlighter from "./RegexHighlighter"

const RegexVisualizer = ({text}: {text: string}) => {
    const defaultRegex = "text (to) be high(li(g)ht)ed"
    const [regex, setRegex] = useState<RegExp>(new RegExp(defaultRegex, "dgs"))
    const ref = useRef<HTMLInputElement>(null)
    const onChange = () => {
        if (ref.current) {
            try {
                setRegex(new RegExp(ref.current.value, "dgs"))
            } catch (e: any) {
                console.error(e)

            }
        }
    }
    return (
        <div>
            <h1>Regex Visualizer</h1>
            <input type="text" ref={ref} onChange={onChange} defaultValue={defaultRegex} className="bg-gray-700 text-white border border-gray-600 rounded p-2"/>
            <br />
            <RegexHighlighter regex={regex} text={text}/>
        </div>
    )
}

export default RegexVisualizer