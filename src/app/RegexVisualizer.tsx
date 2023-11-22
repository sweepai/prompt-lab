"use client"

import { useRef, useState } from "react"
import RegexHighlighter from "./RegexHighlighter"

const RegexVisualizer = ({text, runLLM}: {text: string, runLLM: any}) => {
    const defaultRegex = "<unit_test>(.*)</unit_test>"
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
            <div className="flex mb-4">
                <input type="text" ref={ref} onChange={onChange} defaultValue={defaultRegex} className="text-xs bg-gray-800 border border-gray-700 rounded p-2 font-mono w-full mr-4"/>
                <button
                    className="font-bold text-xl bg-blue-700 hover:bg-blue-800 text-white p-2 rounded w-full text-center w-32"
                    onClick={runLLM}
                >
                    Run
                </button>
            </div>
            <RegexHighlighter regex={regex} text={text}/>
        </div>
    )
}

export default RegexVisualizer