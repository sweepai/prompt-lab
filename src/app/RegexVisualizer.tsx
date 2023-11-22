"use client"

import { useRef, useState } from "react"
import RegexHighlighter from "./RegexHighlighter"

const RegexVisualizer = ({text}: {text: string}) => {
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
            <input type="text" ref={ref} onChange={onChange} defaultValue={defaultRegex} className="text-xs bg-gray-800 border border-gray-700 rounded p-2 font-mono w-full mb-4"/>
            <RegexHighlighter regex={regex} text={text}/>
        </div>
    )
}

export default RegexVisualizer