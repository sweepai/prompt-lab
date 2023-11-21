import { atom } from "recoil";
import { MessageType } from "./Message";

const messagesState = atom<MessageType[]>({
  key: 'todoListState',
  default: [
    {
      content: "You are a helpful assistant.",
      role: "system",
      id: 0
    },
    {
      content: "Say this is a test.",
      role: "user",
      id: 1
    },
  ],
});


export { messagesState };