"use client"

import { useEffect, useRef, useState } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import tomorrowNight from 'react-syntax-highlighter/dist/esm/styles/hljs/tomorrow-night';
import AceEditor from "react-ace";

import 'ace-builds/src-noconflict/theme-monokai'; // Import the theme
import 'ace-builds/src-noconflict/mode-xml';



type RoleType = "system" | "user" | "assistant";

const renderRole = (role: RoleType) => {
  switch (role) {
    case "system":
      return "System";
    case "user":
      return "User";
    case "assistant":
      return "Assistant";
  }
};

const getNextRole = (role: RoleType) => {
  switch (role) {
    case "system":
      return "user";
    case "user":
      return "assistant";
    case "assistant":
      return "system";
  }
};

const colorMapping: { [key in RoleType]: string } = {
  "system": "bg-gray-800 hover:bg-gray-900",
  "user": "bg-blue-800 hover:bg-blue-900",
  "assistant": "bg-green-800 hover:bg-green-900",
}

const AutoScaledTextarea = ({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [])
  return (
    <textarea
      onInput={(e: any) => {
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
      }}
      {...props}
      ref={ref}
    />
  )
}


interface MessageType {
  content: string;
  role: RoleType;
  id: number;
}

const Message = ({
  content,
  role,
  id,
  onChange,
  onChangeRole,
  onDelete,
}: {
  content: string;
  role: RoleType;
  id: number;
  onChange: (newContent: string) => void;
  onChangeRole: () => void;
  onDelete: () => void;
}) => {
  const editorRef = useRef(null);

  const updateHeight = () => {
    if (!editorRef.current) return;
    const editor = editorRef.current.editor;
    const newHeight = editor.getSession().getScreenLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();
    editor.container.style.height = `${newHeight}px`;
    editor.resize();
  };

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      editor.getSession().on('change', updateHeight);
      updateHeight(); // Initial height update
      const editorContent = editor.container.getElementsByClassName('ace_content')[0];
      if (editorContent) {
        editorContent.style.whiteSpace = 'pre-wrap';
      }
    }

    // Cleanup
    return () => {
      if (editorRef.current) {
        const editor = editorRef.current.editor;
        editor.getSession().off('change', updateHeight);
      }
    };
  }, []);

  return (
    <div className="rounded overflow-hidden shadow-lg font-mono mb-3">
      <div className="flex justify-between">
        <button
          className={`font-bold text-lg mb-2 mr-2 text-white p-2 rounded w-full text-left ${colorMapping[role]}`}
          onClick={() => onChangeRole()}
        >
          {renderRole(role)}
        </button>
        <button
          className="font-bold text-lg mb-2 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded w-32 text-center"
          onClick={() => onDelete()}
        >
          Delete
        </button>
      </div>
      <AceEditor
        placeholder="Placeholder Text"
        mode="xml"
        theme="monokai"
        onChange={(newContent: string) => onChange(newContent)}
        fontSize={14}
        showPrintMargin={true}
        showGutter={false}
        highlightActiveLine={false}
        value={content}
        wordEnabled={true}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          whiteSpace: 'pre-wrap !important',
          fontSize: '0.75rem',
          width: '100%',
          height: 'auto',
          padding: '2rem',
          backgroundColor: '#111827',
        }}
        editorRef={editorRef}
        maxLines={20}
        wrap={true}
        setOptions={{
          maxLines: 1000,
          selectionStyle: 'line',
          behavioursEnabled: true,
          wrapBehavioursEnabled: true,
          autoScrollEditorIntoView: true,
          wrap: true
        }}
      />
      {/* <AutoScaledTextarea
        className="w-full bg-gray-800 border-gray-700 p-2 border rounded h-auto max-h-120 text-xs"
        placeholder="Message goes here..."
        onChange={(e: any) => onChange(e.target.value)}
        value={content}
        contentEditable
      /> */}
    </div>
  );
};

export default Message;
export { renderRole, getNextRole };
export type { MessageType };
