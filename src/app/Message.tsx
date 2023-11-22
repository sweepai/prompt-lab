"use client"

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

interface MessageType {
  content: string;
  role: RoleType;
  id: number;
}

// const messagesState = atom<MessageType[]>({
//   key: 'todoListState',
//   default: [
//     {
//       content: "You are a helpful assistant.",
//       role: "system",
//       id: 0
//     },
//     {
//       content: "Say this is a test.",
//       role: "user",
//       id: 1
//     },
//   ],
// });

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
      <textarea
        className="w-full bg-gray-800 border-gray-700 p-2 border rounded h-auto h-max-48 text-xs"
        placeholder="Message goes here..."
        onChange={(e) => onChange(e.target.value)}
        value={content}
      />
    </div>
  );
};

export default Message;
export { renderRole, getNextRole };
export type { MessageType };
