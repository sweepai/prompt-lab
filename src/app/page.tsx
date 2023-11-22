"use client"

import React, { Suspense, useEffect, useState } from "react";
import RegexVisualizer from "./RegexVisualizer";
import "./Highlighter.css"; // Import the CSS file for styling
import Message, { getNextRole, MessageType } from "./Message";
import { RecoilRoot } from 'recoil';

function getRandomInt() {
  return Math.floor(Math.random() * 2147483647); // The maximum is exclusive and the minimum is inclusive
}

const Toast = ({ content }: { content: string }) => {
  return (
    <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
          </svg>
          <span className="sr-only">Error icon</span>
      </div>
      <div className="ms-3 text-sm font-normal">Item has been deleted.</div>
      <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
      </button>
    </div>
  )
}

const Main = () => {
  const [messages, setMessages] = useState<MessageType[]>(() => {
    // Load messages from local storage or default to initial array
    const savedMessages = typeof window !== "undefined" ? localStorage.getItem('messages') : null;
    return savedMessages ? JSON.parse(savedMessages) : [
      { content: "You are a helpful assistant.", role: "system", id: 0 },
      { content: "Say this is a test.", role: "user", id: 1 },
    ];
  });
  console.log(messages)
  const [displayContent, setDisplayContent] = useState<string>("Here is the text to be highlighted like Regex 101");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, []);

  return (
    <RecoilRoot>
      <main className="flex min-h-screen flex-col items-center justify-between p-12 font-mono">
        <h1 className="text-2xl mb-3">Prompt Playground</h1>
        <div className="h-screen w-full flex">
          <div className="w-1/3 p-4">
            {messages.map((message: MessageType) => (
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
                  console.log(messages)
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
              onClick={() => {setMessages((messages: MessageType[]) => [...messages, { content: "", role: "user", id: getRandomInt() }])}}
            >
              Add message
            </button>
          </div>
          <div className="w-2/3 p-4">
            {displayContent ? 
              <RegexVisualizer text={displayContent} /> : "..."
            }
            <button
              className="font-bold text-xl mb-2 bg-blue-700 hover:bg-blue-800 text-white p-2 rounded w-full text-left mt-4"
              onClick={async () => {
                try {
                  console.log(messages)
                  const response = await fetch("/api", {
                    method: "POST", 
                    body: JSON.stringify({
                      messages: messages.map((message: MessageType) => {
                        return {
                          content: message.content,
                          role: message.role
                        }
                      })
                    })
                  })!
                  if (!response.ok) {
                    throw new Error(response.statusText)
                  }
                  const data = await response.json();
                  const message = data.choices[0].message.content;
                  setDisplayContent(message);
                } catch (e) {
                  alert(e)
                  console.error(e);
                }
                // try {
                //   const data = await fetch("/api", {
                //     method: "POST", 
                //     body: JSON.stringify({
                //       messages: messages.map((message: MessageType) => {
                //         return {
                //           content: message.content,
                //           role: message.role
                //         }
                //       })
                //     })
                //   })
                //   const stream = new ReadableStream({
                //     start(controller) {}
                //   });
                //   for await (const chunk of stream.body!) {
                //     // Do something with each 'chunk'
                //     console.log(chunk)
                //   }
                // } catch (e) {
                //   alert(e)
                //   console.error(e);
                // }
              }}
            >
              Run
            </button>
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