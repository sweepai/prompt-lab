"use client"

import { useRef, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import RegexHighlighter from "./RegexHighlighter"

import 'react-toastify/dist/ReactToastify.css';

const RegexVisualizer = ({text, runButton}: {text: string, runButton: JSX.Element}) => {
    const defaultRegex = "<unit_test>(.*)</unit_test>"
    const [regex, setRegex] = useState<RegExp>(new RegExp(defaultRegex, "dgs"))
    const ref = useRef<HTMLInputElement>(null)
    const onChange = () => {
        if (ref.current) {
            try {
                setRegex(new RegExp(ref.current.value, "dgs"))
            } catch (e: any) {
                toast.error(e.message)
            }
        }
    }
    return (
        <div>
            <div className="flex mb-4">
                <input type="text" ref={ref} onChange={onChange} defaultValue={defaultRegex} className="text-xs bg-gray-800 border border-gray-700 rounded p-2 font-mono w-full mr-4"/>
                {runButton}
            </div>
            <RegexHighlighter regex={regex} text={text}/>
            <ToastContainer
                theme="colored"
            />
        </div>
    )
}

export default RegexVisualizer