"use client"

import React, { useState } from "react";
import RegexVisualizer from "./RegexVisualizer";
import "./Highlighter.css"; // Import the CSS file for styling
import Message, { getNextRole, MessageType } from "./Message";
import { messagesState } from "./atoms";
import { RecoilRoot, useRecoilState } from 'recoil';

let id = 0;
function getId() {
  return id++;
}

const Main = () => {
  const [messages, setMessages] = useState<MessageType[]>([
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
  ]);
  console.log(messages)

  return (
    <RecoilRoot>
    <main className="flex min-h-screen flex-col items-center justify-between p-12 font-mono">
      <h1 className="text-2xl mb-3">Prompt Playground</h1>
      <div className="h-screen w-full flex">
        <div className="w-1/3 p-4">
          {messages.map((message: MessageType, index: number) => (
            <Message
              content={message.content}
              role={message.role}
              id={message.id}
              onChange={(newContent: string) => {
                setMessages((messages: MessageType[]) => messages.map((item: MessageType) => {
                  if (item.id === message.id) {
                    return { ...item, content: newContent };
                  }
                  return item;
                }));
              }}
              onChangeRole={() => {
                setMessages((messages: MessageType[]) => messages.map((item: MessageType) => {
                  console.log(item.id, message.id)
                  if (item.id === message.id) {
                    return { ...item, role: getNextRole(item.role) };
                  }
                  return item;
                }));
              }}
              onDelete={() => {
                setMessages((messages: MessageType[]) => messages.filter((item: MessageType) => item.id !== message.id));
              }}
              key={message.id}
            />
          ))}
          <br/>
          <button
            className="font-bold text-xl mb-2 bg-gray-700 hover:bg-gray-800 text-white p-2 rounded w-full text-left"
            onClick={() => {setMessages((messages: MessageType[]) => [...messages, { content: "", role: "user", id: Math.random() }])}}
          >
            Add message
          </button>
        </div>
        <div className="w-2/3 p-4">
          <RegexVisualizer text="Here is the text to be highlighted by like Regex 101" />
        </div>
      </div>
    </main>
    </RecoilRoot>
  )
}

export default function Home() {
  return (
    <RecoilRoot>
      <Main/>
    </RecoilRoot>
  )
}