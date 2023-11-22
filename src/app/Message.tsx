"use client"

import { useEffect, useRef } from "react";

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

const AutoScaledTextarea = ({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    console.log("ref.current", ref.current)
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
}: any) => {
  return (
    <div className="rounded overflow-hidden shadow-lg font-mono mb-3">
      <div className="flex justify-between">
        <button
          className="font-bold text-lg mb-2 mr-2 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded w-full text-left"
          onClick={() => onChangeRole()}
        >
          {renderRole(role)}
        </button>
        <button
          className="font-bold text-lg mb-2 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded w-full text-left"
          onClick={() => onDelete()}
        >
          Delete
        </button>
      </div>
      <AutoScaledTextarea
        className="w-full bg-gray-800 border-gray-700 p-2 border rounded h-auto max-h-120 text-xs"
        placeholder="Message goes here..."
        onChange={(e: any) => onChange(e.target.value)}
        value={content}
        contentEditable
      />
    </div>
  );
};

export default Message;
export { renderRole, getNextRole };
export type { MessageType };
